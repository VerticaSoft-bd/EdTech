const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/streva', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const courses = await mongoose.connection.db.collection('courses').find().toArray();
    console.log(JSON.stringify(courses.map(c => ({ title: c.title, regularFee: c.regularFee })), null, 2));
    process.exit(0);
  });
