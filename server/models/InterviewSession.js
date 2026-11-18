import mongoose from 'mongoose';

const transcriptEntrySchema = new mongoose.Schema(
  {
    speaker: {
      type: String,
      enum: ['interviewer', 'candidate', 'system'],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageId: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
      index: true
    },
    configId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewConfig',
      required: [true, 'Interview config reference is required'],
      index: true
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'interrupted'],
      default: 'in_progress',
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date
    },
    transcript: [transcriptEntrySchema],
    metadata: {
      vapiCallId: { type: String, trim: true },
      callDurationSeconds: { type: Number, default: 0 },
      endReason: { type: String, trim: true },
      questionsCount: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying a student's sessions by configuration
interviewSessionSchema.index({ studentId: 1, configId: 1, createdAt: -1 });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
