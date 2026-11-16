import { GoogleGenAI } from '@google/genai';

/**
 * Validates and sanitizes questions array from Gemini.
 * Never trust raw AI output without schema validation.
 */
function validateQuestions(rawItems, targetDifficulty) {
  if (!Array.isArray(rawItems)) {
    throw new Error('AI response is not an array of questions');
  }

  const validated = [];

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i];
    if (!item || typeof item !== 'object') continue;

    const questionText = typeof item.questionText === 'string' ? item.questionText.trim() : '';
    const competency = typeof item.competency === 'string' ? item.competency.trim() : 'Core Technical Competency';
    
    // Ensure arrays
    const expectedKeyConcepts = Array.isArray(item.expectedKeyConcepts)
      ? item.expectedKeyConcepts.map(c => String(c).trim()).filter(Boolean)
      : ['Fundamental concepts'];

    const evaluationCriteria = Array.isArray(item.evaluationCriteria)
      ? item.evaluationCriteria.map(e => String(e).trim()).filter(Boolean)
      : ['Clarity and technical accuracy'];

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    const difficulty = validDifficulties.includes(item.difficulty)
      ? item.difficulty
      : targetDifficulty || 'Medium';

    if (questionText.length > 10) {
      validated.push({
        questionNumber: validated.length + 1,
        questionText,
        competency,
        expectedKeyConcepts,
        evaluationCriteria,
        difficulty
      });
    }

    if (validated.length === 10) break;
  }

  if (validated.length < 5) {
    throw new Error(`AI generated insufficient valid questions (${validated.length}/10). Validation failed.`);
  }

  return validated;
}

/**
 * Generates 10 structured interview questions using Google Gemini API.
 * Uses primary and fallback models with strict JSON output validation.
 *
 * @param {Object} config - InterviewConfig document
 * @returns {Promise<Array>} Array of 10 validated interview question objects
 */
export async function generateInterviewQuestions(config) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('your_gemini_api_key_here')) {
    throw new Error('GEMINI_API_KEY is not configured in server/.env');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a Principal Engineering Lead and Technical Interviewer at a premier technology company.
Generate exactly 10 comprehensive, realistic, and insightful interview questions for a mock interview session.

Candidate & Session Profile:
- Target Job Role: ${config.role}
- Career Domain: ${config.domain}
- Experience Level: ${config.experienceLevel}
- Interview Category: ${config.category}
- Difficulty Level: ${config.difficulty}

Requirements:
1. Tailor all questions strictly to the role (${config.role}) and experience level (${config.experienceLevel}).
2. The category is ${config.category}. 
   - If Technical: focus on core domain fundamentals, system trade-offs, algorithms, debugging, and real-world implementation.
   - If HR: focus on career aspirations, professional ethics, workplace collaboration, and growth mindset.
   - If Behavioral: use the STAR method (Situation, Task, Action, Result) scenario questions testing conflict, team dynamics, and ownership.
   - If Mixed: provide a realistic interview progression: 6 technical questions, 2 behavioral questions, and 2 situational/system questions.
3. Every question must include:
   - questionText: The exact question to ask the candidate.
   - competency: The specific skill being assessed (e.g., "State Management", "Data Modeling", "Conflict Resolution", "Complexity Analysis").
   - expectedKeyConcepts: Array of 3-5 core technical or conceptual points a top-tier candidate must mention.
   - evaluationCriteria: Array of 2-3 specific rubrics to judge the depth and clarity of the answer.
   - difficulty: "${config.difficulty}"

Output format: Return ONLY a valid JSON array of 10 objects. Do not include markdown preamble or conversational text.`;

  // Candidate models in order of priority
  const candidateModels = [
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3.8-flash'
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (!responseText) {
        throw new Error(`Empty response from ${modelName}`);
      }

      // Clean possible markdown code fences if model enclosed them
      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleanedJson);
      } catch (parseErr) {
        throw new Error(`Failed to parse AI JSON response: ${parseErr.message}`);
      }

      // If wrapped in an object like { questions: [...] }, unwrap it
      const questionsArray = Array.isArray(parsed)
        ? parsed
        : (parsed.questions || parsed.data || parsed.items || []);

      const validated = validateQuestions(questionsArray, config.difficulty);
      return validated;
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Generation Warning] Model '${modelName}' failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw new Error(`Question generation failed across all models. Details: ${lastError?.message || 'Unknown error'}`);
}
