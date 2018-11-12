const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to mongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, // only meaningful validation in mongoose
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network']
  },
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200
  }
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node Course",
    category: 'web',
    author: "sternmd",
    tags: ["node", "backend"],
    isPublished: true,
    price: 15
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

// UPDATE METHOD 1
async function updateCourse1(id) {
  // Approach: Query first
  // findById()
  // Modify its properties
  // save()
  const course = await Course.findById(id);
  if (!course) return;

  course.set({
    isPublished: true,
    author: "Another Author"
  });

  const result = await course.save();
  console.log(result);
}

// UPDATE METHOD 2
async function updateCourse2(id) {
  // Approach: Update first
  // Update directly
  // Optionally: get updated document
  const result = await Course.update({
    _id: id
  }, {
    $set: {
      author: "Mosh",
      isPublished: false
    }
  });

  console.log(result);
}

// updateCourse2('5be5c75079bc5036c08f7691');

// REMOVE SINGLE COURSE
async function removeCourse(id) {
  const result = await Course.deleteOne({
    _id: id
  });
  console.log(result);
}

// removeCourse('5be5c75079bc5036c08f7691');

// REMOVE MULTIPLE COURSES
async function removeCourse(id) {
  // const result = await Course.deleteMany({
  //   _id: id
  // });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
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
  const courses = await Course.find({
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
// createCourse();