const { mongoose } = require("../config/db");
const { guarantorSchema, accountSchema } = require("./profile");

const loanSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "Your firstname is required",
      max: 50,
      index: true,
    },
    lastName: {
      type: String,
      required: "Your lastname is required",
      max: 50,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: "Your phonenumber is required",
      max: 30,
    },
    loanStatus: {
      type: String,
      max: 30,
      index: true,
    },
    email: {
      type: String,
      max: 200,
      index: true,
    },
    bank: {
      type: String,
      required: "Your bank is required",
      max: 100,
      index: true,
    },

    duration: {
      type: Number,
      max: 50,
    },
    amount: {
      type: Number,
      required: "Loan amount is required",
      max: 2000000,
      index: true,
    },

    loanRepayment: {
      type: Number,
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
