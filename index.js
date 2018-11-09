const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('connected to mongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Express Course',
    author: 'sternmd',
    tags: ['node', 'backend'],
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {

  // COMPARISON OPERATORS
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // REGEX 
  // author starts with Max
  // /^Max/

  // author ends with Stern, case-insensive
  // /Stern$/i

  // author contains Max, case-insensive
  // /.*Max.*/i

  // PAGINATION
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10
  const courses = await Course
    .find({
      author: /.*sternmd.*/i,
      isPublished: true
    })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({
      name: 1
    })
    .select({
      name: 1,
      tags: 1
    });

  console.log(courses);
}

getCourses();