const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

DB_USER = process.env.DB_USER;
PASSWORD = process.env.PASSWORD;
CLUSTERNAME = process.env.CLUSTERNAME;

mongoose.connect(
  `mongodb+srv://${DB_USER}:${PASSWORD}@${CLUSTERNAME}.jzsljb4.mongodb.net/user_details`
);

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "Your firstname is required",
      max: 50,
    },
    lastName: {
      type: String,
      required: "Your lastname is required",
      max: 50,
    },
    phoneNumber: {
      type: String,
      required: "Your phonenumber is required",
      max: 30,
    },
    avatar: {
      type: String,
      default: "default_profile_pic.png",
      max: 200,
    },
    gender: {
      type: String,
      required: "Your gender is required",
      max: 10,
    },
    bvn: {
      type: String,
      required: "Your bvn is required",
      max: 15,
    },
    address: {
      type: String,
      required: "Your address is required",
      max: 100,
    },
    currency: {
      type: String,
      max: 10,
    },
    email: {
      type: String,
      required: "Your email is required",
      max: 50,
    },
    userName: {
      type: String,
      max: 50,
    },
    status: {
      type: String,
      max: 25,
    },
  },
  { _id: false }
);

const guarantorSchema = new mongoose.Schema(
  {
    guaAddress: {
      type: String,
      required: "Your address is required",
      max: 100,
    },
    guaFirstName: {
      type: String,
      required: "Your firstname is required",
      max: 50,
    },
    guaLastName: {
      type: String,
      required: "Your lastname is required",
      max: 50,
    },
    guaGender: {
      type: String,
      max: 10,
    },
    guaNumber: {
      type: String,
      required: "Your phone number is required",
      max: 15,
    },
    relationship: {
      type: String,
      max: 30,
    },
  },
  { _id: false }
);

const socialsSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      max: 30,
    },
    twitter: {
      type: String,
      max: 30,
    },
    instagram: {
      type: String,
      max: 30,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      max: 30,
    },
  },
  { _id: false }
);

const organizationSchema = new mongoose.Schema(
  {
    orgName: {
      type: String,
      required: "Your address is required",
      max: 30,
    },
    orgNumber: {
      type: String,
      max: 30,
    },
    employmentStatus: {
      type: String,
      max: 30,
    },
    sector: {
      type: String,
      max: 50,
    },
    duration: {
      type: String,
      max: 10,
    },
    officeEmail: {
      type: String,
      max: 50,
    },
  },
  { _id: false }
);

const accountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: "Your address is required",
      max: 30,
    },
    accountBalance: {
      type: Number,
    },
    loanRepayment: {
      type: Number,
    },
    bank: {
      type: String,
      max: 30,
    },
    accountNumber: {
      type: String,
    },
    monthlyIncome: {
      type: Array,
    },
  },
  { _id: false }
);

const mongoUserProfileSchema = new mongoose.Schema(
  {
    profile: profileSchema,
    guarantor: guarantorSchema,
    socials: socialsSchema,
    education: educationSchema,
    organization: organizationSchema,
    account: accountSchema,
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("Profile", mongoUserProfileSchema, "users");

module.exports = UserProfile;
