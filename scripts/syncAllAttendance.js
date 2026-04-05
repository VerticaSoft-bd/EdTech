const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Basic env parser for .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

async function syncAll() {
  try {
    loadEnv();
    const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
    if (!uri) {
      console.error('Database connection string (DATABASE_URL or MONGODB_URI) not found in .env.local');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define Schemas if models aren't available
    const StudentSchema = new mongoose.Schema({
      email: String,
      courseName: String,
      attendedClasses: Number,
      totalClasses: Number
    }, { timestamps: true });
    
    // Check if model already exists
    const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

    const AttendanceSchema = new mongoose.Schema({
      studentEmail: String,
      courseName: String,
      status: String,
      date: Date
    });
    const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

    const allStudents = await Student.find({});
    console.log(`Found ${allStudents.length} student enrollment records to sync...`);

    let syncCount = 0;
    for (const student of allStudents) {
      const { email, courseName } = student;
      if (!email || !courseName) continue;

      const totalHeld = await Attendance.countDocuments({
        studentEmail: email,
        courseName
      });

      const attended = await Attendance.countDocuments({
        studentEmail: email,
        courseName,
        status: 'Present'
      });

      await Student.updateOne(
        { _id: student._id },
        { 
          $set: { 
            attendedClasses: attended,
            totalClasses: totalHeld || 0 
          } 
        }
      );
      syncCount++;
      if (syncCount % 10 === 0) console.log(`Synced ${syncCount}/${allStudents.length} records...`);
    }

    console.log(`All ${syncCount} student records synced successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

syncAll();
