const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      unique: true,
      maxLength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      maxLength: [500, "Description can not be more than 500 characters"],
      required: [true, "Please add a description"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxLength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      //GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2sphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

// Add Virutal Field (Courses)

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
});

BootcampSchema.pre("findOne", function (next) {
  this.populate("courses");
  next();
});
// Add MiddleWare For cascade Deleteing Courses related to BootCamp
BootcampSchema.pre("remove", async function (next) {
  console.log(`Deleting Courses Related to Bootcamp ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Add MiddleWare to handle the Slug Field
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// GeoCoder and Adding location Data
BootcampSchema.pre("save", async function (next) {
  const [loc] = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc.longitude, loc.latitude],
    formattedAddress: loc.formattedAddress,
    street: loc.streetName,
    city: loc.city,
    state: loc.stateCode,
    zipcode: loc.zipcode,
    country: loc.countryCode,
  };

  // Don't save Address
  this.address = undefined;
  next();
});
module.exports = mongoose.model("Bootcamp", BootcampSchema);
