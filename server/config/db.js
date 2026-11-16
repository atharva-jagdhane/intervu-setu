import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using Mongoose ODM.
 * Handles credential verification, connection timeouts, and connection errors.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('PASTE_YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE')) {
    console.error('\n❌ [MongoDB Error]: MONGODB_URI is not configured in server/.env.');
    console.error('👉 Please open server/.env and paste your MongoDB Atlas connection string.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5-second timeout for quick feedback
    });

    console.log(`\n✅ [MongoDB Atlas Connected]: ${conn.connection.host}`);
    console.log(`📦 [Database Name]: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}`);
    console.error('🔍 [Troubleshooting Checklist]:');
    console.error('   1. Verify your database username and password in the URI.');
    console.error('   2. If password contains special characters (@, #, %, etc.), ensure it is URL-encoded.');
    console.error('   3. In MongoDB Atlas > Network Access, ensure your current IP or "0.0.0.0/0" is whitelisted.');
    console.error('   4. Check your internet connection.\n');
    return false;
  }
};
