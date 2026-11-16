import mongoose from 'mongoose';

const interviewConfigSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
      index: true
    },
    domain: {
      type: String,
      required: [true, 'Interview domain is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: {
        values: ['Internship', 'Fresher / Entry-level', 'Junior Engineer'],
        message: '{VALUE} is not a valid experience level'
      }
    },
    category: {
      type: String,
      required: [true, 'Interview category is required'],
      enum: {
        values: ['Technical', 'HR', 'Behavioral', 'Mixed'],
        message: '{VALUE} is not a valid interview category'
      }
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level'
      }
    },
    status: {
      type: String,
      enum: ['configured', 'in-progress', 'completed'],
      default: 'configured'
    }
  },
  {
    timestamps: true
  }
);

const InterviewConfig = mongoose.model('InterviewConfig', interviewConfigSchema);
export default InterviewConfig;
