const { Histogram } = require("prom-client");
const db = require("./src/models");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
const { Search, AdvanceFilter } = require("./src/controllers/ProfilePipeline");
const AllLoans = require("./src/controllers/LoanPipeline");
const mongoose = require("mongoose");
const logger = require("./logger");

dotenv.config();

const UserProfile = db.UserProfile;
const User = db.User;
const Loan = db.Loan;

// Create a Histogram for measuring resolver execution time
const resolverDuration = new Histogram({
  name: "graphql_resolver_duration_seconds",
  help: "Duration of GraphQL resolver execution in seconds",
  labelNames: ["resolver"],
});

// Wrap each resolver to measure its execution time
const wrapResolver =
  (resolverName, resolverFn) => async (root, args, context, info) => {
    const end = resolverDuration.startTimer({ resolver: resolverName });
    try {
      return await resolverFn(root, args, context, info);
    } finally {
      end();
    }
  };

const Query = {
  greetings: () => "Test Success, GraphQL server is up & running !!",
  test: wrapResolver("test", async (_, args, { user }) => {
    const id = new mongoose.Types.ObjectId(`${args._id}`);
    const person = await UserProfile.findOne({
      _id: id,
    }).exec();
    logger.info(person);
    return person;
  }),
  students: () => db.students.list(),
  user: wrapResolver("user", async (root, args, context, info) => {
    const user = await User.findOne({
      where: {
        UserID: args.id,
      },
    });
    return user;
  }),
  login: wrapResolver("login", async (root, args, context, info) => {
    try {
      const userExist = await User.findOne({
        where: {
          email: args.input.email,
        },
      });

      if (!userExist) return { message: "This Email is not Registered" };
      const passwordIsValid = bcrypt.compareSync(
        args.input.password,
        userExist.password
      );
      if (!passwordIsValid) return { message: "This Password is Invalid" };
      const token = jwt.sign(
        { id: userExist.UserID },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        }
      );

      const profile = await UserProfile.findOne({
        "profile.email": userExist.email,
      }).exec();

      const phone = profile.profile.phoneNumber;

      return {
        _id: profile._id,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        state: userExist.state,
        phoneNumber: phone,
        token: token,
        is_staff: userExist.is_staff,
      };
    } catch (err) {
      logger.error(`Error during login: ${err.message}`);
      throw new Error(`Error during login: ${err.message}`);
    }
  }),
  getLoan: wrapResolver("getLoan", async (_, args, { user }) => {
    if (!user) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const loan = await Loan.find({ "loan.email": args.email }).exec();
      return loan;
    } catch (err) {
      logger.error(`Error in getLoan Query: ${err.message}`);
      throw new Error(`Error in getLoan Query: ${err.message}`);
    }
  }),
  getProfile: wrapResolver("getProfile", async (_, args, { user }) => {
    if (!user) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const profile = await UserProfile.findOne({
        "profile.email": args.email,
      }).exec();
      return profile;
    } catch (err) {
      logger.error(`Error in getProfile Query: ${err.message}`);
      throw new Error(`Error in getProfile Query: ${err.message}`);
    }
  }),

  getUsers: wrapResolver("getUsers", async (_, args, { user }) => {
    if (!user) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const result = await Search(args.page, args.limit, args.search);

      return {
        users_paginated: result[0].documents,
        all_users: result[0].totalDocuments,
        loan: result[0].totalWithLoan,
        active: result[0].totalActive,
        savings: result[0].totalWithSavings,
      };
    } catch (err) {
      logger.error(`Error in getUsers Query: ${err.message}`);
      throw new Error(`Error in getUsers Query: ${err.message}`);
    }
  }),
  advancedFilter: wrapResolver("advancedFilter", async (_, args, { user }) => {
    if (!user) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const condition = { ...args };
      const result = await AdvanceFilter(condition);
      logger.info(result);
      return {
        users_paginated: result[0].documents,
        all_users: result[0].totalDocuments,
        loan: result[0].totalWithLoan,
        active: result[0].totalActive,
        savings: result[0].totalWithSavings,
      };
    } catch (err) {
      logger.error(`Error in advancedFilter: ${err.message}`);
      throw new Error(`Error in advancedFilter: ${err.message}`);
    }
  }),
  getAllLoans: wrapResolver("getAllLoans", async (_, args, { user }) => {
    if (!user) {
      logger.error("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const result = await AllLoans(args.page, args.limit, args.search);

      return {
        loans_paginated: result[0].documents,
        all_loans: result[0].totalDocuments,
        active: result[0].totalWithLoan,
      };
    } catch (err) {
      logger.error(`Error in getAllLoans Query: ${err.message}`);
      throw new Error(`Error in getAllLoans Query: ${err.message}`);
    }
  }),
};

const Mutation = {
  registerUser: wrapResolver(
    "registerUser",
    async (root, args, context, info) => {
      try {
        const user = await User.findOne({
          where: {
            email: args.input.email,
          },
        });

        if (user) {
          return "email already registered";
        }
        const new_user = {
          ...args.input,
          password: bcrypt.hashSync(args.input.password, 8),
        };
        const newUser = User.create(new_user);
        if (newUser) {
          return "registration successful";
        } else {
          return "registration unsuccessful";
        }
      } catch (err) {
        logger.error(`Error in registerUser: ${err.message}`);
        return `cannot fetch from database ${err}`;
      }
    }
  ),
  addProfile: wrapResolver("addProfile", async (root, args, context, info) => {
    try {
      const user = await UserProfile.findOne({
        "profile.email": args.input.profile.email,
      }).exec();
      if (!user) {
        const newUser = new UserProfile(args.input);
        const savedProfile = await newUser.save();
        return `Profile ${savedProfile._id.toString()} added`;
      }
      logger.info("Profile Already Exists");
      return "Profile Already Exists";
    } catch (err) {
      logger.error(`Error in addProfile: ${err.message}`);
      throw new Error(`Error in addProfile: ${err.message}`);
    }
  }),
  newLoan: wrapResolver("newLoan", async (_, args, { user }) => {
    if (!user) {
      logger.info("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const newLoan = new Loan(args.input);
      await newLoan.save();
      return "Loan Application Successful";
    } catch (err) {
      logger.error(`Error in NewLoan: ${err.message}`);
      throw new Error(`Error in NewLoan: ${err.message}`);
    }
  }),
  updateProfile: wrapResolver("updateProfile", async (_, args, { user }) => {
    if (!user) {
      logger.info("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      let query = {};

      for (const key in args.input) {
        if (key !== "_id" && args.input[key]) {
          for (const subKey in args.input[key]) {
            const queryKey = `${key}.${subKey}`;
            query[queryKey] = args.input[key][subKey];
          }
        }
      }

      await UserProfile.updateOne(
        { "profile.email": args.input._id },
        {
          $set: query,
        },
        { upsert: true }
      ).exec();
      return "Profile Updated";
    } catch (err) {
      logger.error(`Error in Profile Update: ${err.message}`);
      throw new Error(`Error in Profile Update: ${err.message}`);
    }
  }),
  updateStatus: wrapResolver("updateStatus", async (_, args, { user }) => {
    if (!user) {
      logger.info("Unauthorized");
      throw new Error("Unauthorized");
    }
    try {
      const person = await UserProfile.findOneAndUpdate(
        { "profile.email": args.email },
        { $set: { "profile.status": args.status } },
        { new: true }
      ).exec();

      return person;
    } catch (err) {
      logger.error(`Error in Status Update: ${err.message}`);
      throw new Error(`Error in Status Update: ${err.message}`);
    }
  }),
  adminLoanUpdate: wrapResolver(
    "adminLoanUpdate",
    async (_, args, { user }) => {
      if (!user) {
        logger.info("Unauthorized");
        throw new Error("Unauthorized");
      }
      try {
        await Loan.updateOne(
          { "loan.email": args.email },
          { $set: { "loan.loanRepayment": args.loanRepayment } }
        ).exec();
        return "Updated Successfully";
      } catch (err) {
        logger.error(`Error in adminLoanUpdate: ${err.message}`);
        throw new Error(`Error in adminLoanUpdate: ${err.message}`);
      }
    }
  ),
  updateLoanStatus: wrapResolver(
    "updateLoanStatus",
    async (_, args, { user }) => {
      if (!user) {
        logger.info("Unauthorized");
        throw new Error("Unauthorized");
      }
      try {
        const result = await Loan.findOneAndUpdate(
          { "loan.email": args.email },
          { $set: { "loan.loanStatus": args.status } }
        ).exec();
        return result;
      } catch (err) {
        logger.error(`Error in updateLoanStatus: ${err.message}`);
        throw new Error(`Error in updateLoanStatus: ${err.message}`);
      }
    }
  ),
};

const StringOrObject = {
  __resolveType(obj, context, info) {
    if (obj.message) {
      return "StringResult"; // If 'message' exists, resolve to StringResult
    }
    if (obj.email) {
      return "User"; // If 'email' exists, resolve to User
    }
    return null;
  },
};
module.exports = { Query, Mutation, StringOrObject };
