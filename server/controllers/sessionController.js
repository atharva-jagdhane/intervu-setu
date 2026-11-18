import mongoose from 'mongoose';
import InterviewConfig from '../models/InterviewConfig.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewSession from '../models/InterviewSession.js';

/**
 * @desc    Start or initialize an interview session and generate Vapi assistant overrides
 * @route   POST /api/interview/session/start
 * @access  Private (Student only)
 */
export const startSession = async (req, res) => {
  try {
    const { configId } = req.body;

    // 1. Validate ObjectId
    if (!configId || !mongoose.Types.ObjectId.isValid(configId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid interview configuration ID is required.'
      });
    }

    // 2. Fetch config and enforce ownership
    const config = await InterviewConfig.findById(configId);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Interview configuration not found.'
      });
    }

    if (!config.studentId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this interview configuration.'
      });
    }

    // 3. Retrieve questions for this config
    const questions = await InterviewQuestion.find({
      configId: config._id,
      studentId: req.user._id
    }).sort({ questionNumber: 1 });

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions have been generated for this configuration yet. Please generate questions first.'
      });
    }

    // 4. Create new in-progress session
    const session = await InterviewSession.create({
      studentId: req.user._id,
      configId: config._id,
      status: 'in_progress',
      startedAt: new Date(),
      transcript: [],
      metadata: {
        questionsCount: questions.length
      }
    });

    // 5. Build dynamic session-specific Vapi assistant overrides
    const studentFirstName = req.user.name?.split(' ')[0] || 'Candidate';
    const firstQ = questions[0];

    const assistantOverrides = {
      firstMessage: `Hello ${studentFirstName}! Welcome to your mock interview for the ${config.role} position. I am your IntervuSetu AI Interviewer. We will go through ${questions.length} questions tailored to your profile. When you're ready, let's begin with Question 1: ${firstQ.questionText}`,
      firstMessageMode: 'assistant-speaks-first',
      variableValues: {
        studentName: req.user.name,
        domain: config.domain,
        role: config.role,
        experienceLevel: config.experienceLevel,
        category: config.category,
        difficulty: config.difficulty,
        totalQuestions: questions.length
      },
      model: {
        messages: [
          {
            role: 'system',
            content: `You are the IntervuSetu AI Interviewer, a professional, articulate, and encouraging technical interviewer conducting a live mock interview with ${req.user.name} for the position of ${config.role} (${config.experienceLevel}, ${config.difficulty} difficulty in ${config.domain}).

INTERVIEW STRUCTURE:
You must ask the candidate the following ${questions.length} questions in EXACT ORDER from Question 1 to Question ${questions.length}:

${questions
  .map(
    (q) =>
      `[Question ${q.questionNumber}] (${q.competency}): ${q.questionText}\nExpected Key Concepts: ${q.expectedKeyConcepts.join(', ')}`
  )
  .join('\n\n')}

STRICT INTERVIEW RULES:
1. Ask only ONE question at a time.
2. Listen attentively as the candidate answers.
3. Once the candidate finishes speaking, provide a brief, professional acknowledgment (e.g., "Thank you for explaining that." or "Good point.").
4. You may ask ONE concise follow-up question if their answer was incomplete or requires slight clarification.
5. Then, advance explicitly to the next question by saying: "Now, let's proceed to Question [X]: [Question text]".
6. Do NOT skip any questions from the Question Bank.
7. Do NOT invent arbitrary questions outside this list.
8. Keep your conversational turns concise, natural, and realistic for a real voice interview.
9. When all ${questions.length} questions are completed, conclude warmly: "That concludes all questions for our mock interview today. Thank you for your time and thoughtful responses! You can now end the call to view your session transcript."`
          }
        ]
      }
    };

    res.status(201).json({
      success: true,
      message: 'Interview session initiated successfully.',
      session,
      config,
      questions,
      assistantOverrides
    });
  } catch (error) {
    console.error('Start interview session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error starting interview session.'
    });
  }
};

/**
 * @desc    Append transcript messages to an active interview session
 * @route   POST /api/interview/session/:sessionId/transcript
 * @access  Private (Student only)
 */
export const saveTranscript = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { entries } = req.body;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid session ID is required.'
      });
    }

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'An array of transcript entries is required.'
      });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.'
      });
    }

    // Ownership check
    if (!session.studentId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this interview session.'
      });
    }

    // Deduplication logic: prevent inserting identical messages
    const existingSignatures = new Set(
      session.transcript.map(
        (t) => `${t.speaker}|${t.text?.trim()}|${t.messageId || ''}`
      )
    );

    let addedCount = 0;
    for (const entry of entries) {
      if (!entry.speaker || !entry.text) continue;

      const trimmedText = entry.text.trim();
      if (!trimmedText) continue;

      const signature = `${entry.speaker}|${trimmedText}|${entry.messageId || ''}`;
      if (!existingSignatures.has(signature)) {
        session.transcript.push({
          speaker: entry.speaker,
          text: trimmedText,
          timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(),
          messageId: entry.messageId || undefined
        });
        existingSignatures.add(signature);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      await session.save();
    }

    res.status(200).json({
      success: true,
      message: `Appended ${addedCount} transcript entries.`,
      totalEntries: session.transcript.length
    });
  } catch (error) {
    console.error('Save transcript error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving transcript entries.'
    });
  }
};

/**
 * @desc    Complete or interrupt an interview session
 * @route   POST /api/interview/session/:sessionId/end
 * @access  Private (Student only)
 */
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, metadata } = req.body;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid session ID is required.'
      });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.'
      });
    }

    if (!session.studentId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this interview session.'
      });
    }

    // Set status (completed or interrupted)
    const validStatuses = ['completed', 'interrupted'];
    session.status = validStatuses.includes(status) ? status : 'completed';
    session.endedAt = new Date();

    if (metadata) {
      session.metadata = {
        ...session.metadata,
        ...metadata
      };
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: `Interview session marked as ${session.status}.`,
      session
    });
  } catch (error) {
    console.error('End interview session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error ending interview session.'
    });
  }
};

/**
 * @desc    Retrieve a single interview session with its transcript
 * @route   GET /api/interview/session/:sessionId
 * @access  Private (Student only)
 */
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid session ID is required.'
      });
    }

    const session = await InterviewSession.findById(sessionId)
      .populate('configId')
      .lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found.'
      });
    }

    if (session.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this interview session.'
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving session.'
    });
  }
};

/**
 * @desc    Retrieve student's interview session history
 * @route   GET /api/interview/sessions
 * @access  Private (Student only)
 */
export const getMySessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ studentId: req.user._id })
      .populate('configId', 'domain role experienceLevel difficulty category')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get student sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving interview sessions.'
    });
  }
};
