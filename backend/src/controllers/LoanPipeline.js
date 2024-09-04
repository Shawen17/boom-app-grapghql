const Loan = require("../models/loan");
const logger = require("../../logger");

async function AllLoans(page, limit, search) {
  const skip = (page - 1) * limit;

  function createPipeline() {
    const regexPattern = search ? new RegExp(`.*${search}.*`, "i") : null;

    const matchStage = search
      ? {
          $match: {
            $and: [
              { guarantor: { $exists: true } },
              {
                $or: [
                  { "loan.email": { $regex: regexPattern } },
                  { "loan.firstName": { $regex: regexPattern } },
                  { "loan.lastName": { $regex: regexPattern } },
                  { "loan.bank": { $regex: regexPattern } },
                  { "loan.loanStatus": { $regex: regexPattern } },
                  { "loan.amount": { $regex: regexPattern } },
                ],
              },
            ],
          },
        }
      : {
          $match: { guarantor: { $exists: true } },
        };

    const pipeline = [
      matchStage,
      {
        $facet: {
          counts: [
            {
              $addFields: {
                hasLoan: { $eq: ["$loan.loanStatus", "Active"] },
              },
            },
            {
              $group: {
                _id: null,
                totalDocuments: { $sum: 1 },
                totalWithLoan: { $sum: { $cond: ["$hasLoan", 1, 0] } },
              },
            },
          ],
          documents: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                loan: 1,
                guarantor: 1,
                account: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        // Combine counts and documents into a single output
        $project: {
          totalDocuments: { $arrayElemAt: ["$counts.totalDocuments", 0] },
          totalWithLoan: { $arrayElemAt: ["$counts.totalWithLoan", 0] },
          documents: {
            $map: {
              input: "$documents",
              as: "doc",
              in: {
                _id: { $toString: "$$doc._id" },
                loan: "$$doc.loan",
                guarantor: "$$doc.guarantor",
                account: "$$doc.account",
                createdAt: "$$doc.createdAt",
              },
            },
          },
        },
      },
    ];

    return pipeline;
  }
  try {
    const result = await Loan.aggregate(createPipeline());
    return result;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = AllLoans;
