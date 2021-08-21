const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require("fs");
const colors = require('colors')
// Load env vars
dotenv.config({path: './config/config.env'})

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course")

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Read JSON FILES
const Bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);
const Courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`)
);


// Import Data to DB
const importData = async () => {
  try {
    await Bootcamp.create(Bootcamps);
    await Course.create(Courses);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log("Data Deleted...".red.inverse);
    process.exit()
  } catch (err) {
    console.log(err);
  }
};



if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
