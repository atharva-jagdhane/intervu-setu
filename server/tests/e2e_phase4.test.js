import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import InterviewConfig from '../models/InterviewConfig.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import InterviewSession from '../models/InterviewSession.js';
import {
  createConfig,
  generateQuestions,
  getQuestionsByConfig
} from '../controllers/interviewController.js';
import {
  startSession,
  saveTranscript,
  endSession,
  getSessionById,
  getMySessions
} from '../controllers/sessionController.js';

// Express mock helper
function mockReqRes(body = {}, params = {}, query = {}, user = null) {
  const req = { body, params, query, user };
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    }
  };
  return { req, res };
}

async function runPhase4E2ETest() {
  console.log('🚀 Running Comprehensive Phase 4 E2E Test Suite...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Create Test Students (Primary and Unauthorized Attacker)
    const primaryStudent = await User.findOneAndUpdate(
      { email: 'e2e_student_primary@intervusetu.com' },
      {
        name: 'Atharva Candidate',
        email: 'e2e_student_primary@intervusetu.com',
        passwordHash: '$2a$10$dummyhashedpasswordforautomatedtestingsuite',
        education: 'B.Tech Computer Science',
        targetRole: 'Frontend Developer'
      },
      { upsert: true, new: true }
    );

    const attackerStudent = await User.findOneAndUpdate(
      { email: 'e2e_student_attacker@intervusetu.com' },
      {
        name: 'Unauthorized Stranger',
        email: 'e2e_student_attacker@intervusetu.com',
        passwordHash: '$2a$10$dummyhashedpasswordforautomatedtestingsuite',
        education: 'B.Com',
        targetRole: 'Data Analyst'
      },
      { upsert: true, new: true }
    );

    console.log('✅ Test Student 1 (Authorized):', primaryStudent.email, primaryStudent._id);
    console.log('✅ Test Student 2 (Attacker):  ', attackerStudent.email, attackerStudent._id);

    // 2. Test Configuration Creation
    console.log('\n--- Step 1: Create Interview Configuration ---');
    const { req: cReq, res: cRes } = mockReqRes(
      {
        domain: 'Software Engineering',
        role: 'Frontend Developer',
        experienceLevel: 'Fresher / Entry-level',
        category: 'Technical',
        difficulty: 'Medium'
      },
      {},
      {},
      primaryStudent
    );
    await createConfig(cReq, cRes);
    if (cRes.statusCode !== 201 || !cRes.data.config) {
      throw new Error(`Failed to create config: ${JSON.stringify(cRes.data)}`);
    }
    const configId = cRes.data.config._id.toString();
    console.log('✅ Config Created with ID:', configId);

    // 3. Test Question Generation (Simulating or calling Gemini)
    console.log('\n--- Step 2: Seed Generated Questions ---');
    const sampleQuestions = [
      {
        studentId: primaryStudent._id,
        configId: cRes.data.config._id,
        questionNumber: 1,
        questionText: 'Explain the difference between useState and useReducer in React.',
        competency: 'State Management',
        expectedKeyConcepts: ['Complex state transitions', 'Reducer function', 'Predictable actions'],
        evaluationCriteria: ['Explains trade-offs', 'Mentions dispatch pattern'],
        difficulty: 'Medium'
      },
      {
        studentId: primaryStudent._id,
        configId: cRes.data.config._id,
        questionNumber: 2,
        questionText: 'How does CSS Grid differ from Flexbox, and when would you choose one over the other?',
        competency: 'Web Layout & CSS',
        expectedKeyConcepts: ['1D vs 2D', 'Content-driven vs Layout-driven'],
        evaluationCriteria: ['Understands grid track definition', 'Understands flex direction'],
        difficulty: 'Medium'
      }
    ];
    await InterviewQuestion.insertMany(sampleQuestions);
    console.log(`✅ Seeded ${sampleQuestions.length} interview questions for config ${configId}`);

    // 4. Test Starting Real-Time Interview Session
    console.log('\n--- Step 3: Start Real-Time Interview Session ---');
    const { req: sReq, res: sRes } = mockReqRes({ configId }, {}, {}, primaryStudent);
    await startSession(sReq, sRes);

    if (sRes.statusCode !== 201 || !sRes.data.session) {
      throw new Error(`Failed to start session: ${JSON.stringify(sRes.data)}`);
    }

    const sessionId = sRes.data.session._id.toString();
    console.log('✅ Session Created with ID:', sessionId);
    console.log('✅ Status:', sRes.data.session.status);
    console.log('✅ Dynamic First Message Generated:');
    console.log('   ->', sRes.data.assistantOverrides.firstMessage);

    // Verify Vapi credentials are NOT in the session response
    const jsonStr = JSON.stringify(sRes.data);
    if (jsonStr.includes('GEMINI_API_KEY') || jsonStr.includes('VITE_VAPI_PUBLIC_KEY')) {
      throw new Error('Security violation: Private/sensitive tokens exposed in API response!');
    }
    console.log('🔒 Verified: No sensitive environment keys leaked in response.');

    // 5. Test Cross-Student Access Protection
    console.log('\n--- Step 4: Test Cross-Student Access Protection ---');
    const { req: aReq1, res: aRes1 } = mockReqRes({ configId }, {}, {}, attackerStudent);
    await startSession(aReq1, aRes1);
    if (aRes1.statusCode !== 403) {
      throw new Error(`Attacker startSession succeeded with status ${aRes1.statusCode}! Expected 403.`);
    }
    console.log('✅ Attacker prevented from starting session on Student 1 config (403 Forbidden)');

    const { req: aReq2, res: aRes2 } = mockReqRes({}, { sessionId }, {}, attackerStudent);
    await getSessionById(aReq2, aRes2);
    if (aRes2.statusCode !== 403) {
      throw new Error(`Attacker getSessionById succeeded with status ${aRes2.statusCode}! Expected 403.`);
    }
    console.log('✅ Attacker prevented from reading Student 1 session (403 Forbidden)');

    // 6. Test Transcript Appending & Deduplication
    console.log('\n--- Step 5: Test Live Transcript Appending & Deduplication ---');
    const incomingTranscripts = [
      {
        speaker: 'interviewer',
        text: 'Explain the difference between useState and useReducer in React.',
        timestamp: new Date().toISOString(),
        messageId: 'msg_001'
      },
      {
        speaker: 'candidate',
        text: 'useState is great for simple independent states, while useReducer is best when state logic is complex.',
        timestamp: new Date().toISOString(),
        messageId: 'msg_002'
      }
    ];

    const { req: tReq1, res: tRes1 } = mockReqRes({ entries: incomingTranscripts }, { sessionId }, {}, primaryStudent);
    await saveTranscript(tReq1, tRes1);
    console.log(`✅ Appended transcripts: totalEntries = ${tRes1.data.totalEntries}`);

    // Re-send same entries (testing idempotency / deduplication)
    const { req: tReq2, res: tRes2 } = mockReqRes({ entries: incomingTranscripts }, { sessionId }, {}, primaryStudent);
    await saveTranscript(tReq2, tRes2);
    console.log(`✅ Duplicate re-send handled: totalEntries = ${tRes2.data.totalEntries}`);

    if (tRes1.data.totalEntries !== 2 || tRes2.data.totalEntries !== 2) {
      throw new Error(`Deduplication failure: expected 2 entries, got ${tRes2.data.totalEntries}`);
    }

    // 7. Test Ending Session with Duration and Metadata
    console.log('\n--- Step 6: Test Session Completion ---');
    const { req: eReq, res: eRes } = mockReqRes(
      {
        status: 'completed',
        metadata: {
          callDurationSeconds: 180,
          endReason: 'call_ended',
          vapiCallId: 'vapi_call_sim_9981'
        }
      },
      { sessionId },
      {},
      primaryStudent
    );
    await endSession(eReq, eRes);
    if (eRes.statusCode !== 200 || eRes.data.session.status !== 'completed') {
      throw new Error(`Failed to end session: ${JSON.stringify(eRes.data)}`);
    }
    console.log('✅ Session marked as completed.');
    console.log('✅ Duration recorded:', eRes.data.session.metadata.callDurationSeconds, 'seconds');
    console.log('✅ Ended at:', eRes.data.session.endedAt);

    // 8. Test Retrieving Student Sessions History
    console.log('\n--- Step 7: Test Session History Retrieval ---');
    const { req: hReq, res: hRes } = mockReqRes({}, {}, {}, primaryStudent);
    await getMySessions(hReq, hRes);
    if (hRes.statusCode !== 200 || hRes.data.count < 1) {
      throw new Error('Failed to retrieve student session history');
    }
    console.log(`✅ Retrieved ${hRes.data.count} sessions for authenticated student.`);

    // 9. Clean up test data
    console.log('\n🧹 Cleaning up test artifacts from database...');
    await InterviewSession.deleteMany({ studentId: { $in: [primaryStudent._id, attackerStudent._id] } });
    await InterviewQuestion.deleteMany({ configId: cRes.data.config._id });
    await InterviewConfig.deleteMany({ studentId: { $in: [primaryStudent._id, attackerStudent._id] } });
    await User.deleteMany({ _id: { $in: [primaryStudent._id, attackerStudent._id] } });
    console.log('✅ Database cleanup completed cleanly.');

    console.log('\n🏆 ALL PHASE 4 E2E TESTS PASSED WITH 100% SUCCESS!\n');
  } catch (err) {
    console.error('❌ E2E Test Failure:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runPhase4E2ETest();
