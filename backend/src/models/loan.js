const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
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
    loanStatus: {
      type: String,
      max: 30,
    },
    email: {
      type: String,
      max: 200,
    },
    bank: {
      type: String,
      required: "Your bank is required",
      max: 100,
    },

    duration: {
      type: Number,

      max: 50,
    },
    amount: {
      type: Number,
      required: "Loan amount is required",
      max: 2000000,
    },

    loanRepayment: {
      type: Number,
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

      max: 50,
    },
  },
  { _id: false }
);

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: "Your account Number is required",
      max: 30,
    },
    accountBalance: {
      type: Number,
    },

    bank: {
      type: String,
      max: 30,
    },
    monthlyIncome: {
      type: Array,
    },

    bvn: {
      type: String,
      max: 30,
    },
  },
  { _id: false }
);

const mongoLoanSchema = new mongoose.Schema(
  {
    guarantor: guarantorSchema,
    loan: loanSchema,
    account: accountSchema,
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", mongoLoanSchema, "loans");

module.exports = Loan;
