const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://user1:user1@cluster0.hft4x.mongodb.net/edtech?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB");
  const StudentSchema = new mongoose.Schema({
        courseName: String,
        email: String,
        dueAmount: Number,
  });
  const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
  const students = await Student.find({}, 'email courseName dueAmount').limit(5);
  console.log("Sample Students:", students);
  process.exit(0);
}
test().catch(err => { console.error(err); process.exit(1); });
