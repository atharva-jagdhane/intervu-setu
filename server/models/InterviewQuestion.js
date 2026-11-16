import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
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
      required: [true, 'Interview configuration reference is required'],
      index: true
    },
    questionNumber: {
      type: Number,
      required: [true, 'Question order number is required']
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    competency: {
      type: String,
      required: [true, 'Core competency is required'],
      trim: true
    },
    expectedKeyConcepts: {
      type: [String],
      required: [true, 'Expected key concepts array is required'],
      default: []
    },
    evaluationCriteria: {
      type: [String],
      required: [true, 'Evaluation criteria array is required'],
      default: []
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard']
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast retrieval ordered by question number
interviewQuestionSchema.index({ configId: 1, questionNumber: 1 });

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
