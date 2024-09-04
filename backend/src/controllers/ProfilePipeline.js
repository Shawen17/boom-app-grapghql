const { UserProfile } = require("../models/profile"); // Adjust the path as needed
const logger = require("../../logger");

async function Search(page, limit, search) {
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
                  { "profile.email": { $regex: regexPattern } },
                  { "profile.userName": { $regex: regexPattern } },
                  { "profile.firstName": { $regex: regexPattern } },
                  { "profile.lastName": { $regex: regexPattern } },
                  { "profile.status": { $regex: regexPattern } },
                  { "organization.orgName": { $regex: regexPattern } },
                  { "organization.sector": { $regex: regexPattern } },
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
                isActive: { $eq: ["$profile.status", "Active"] },
                hasLoan: { $gt: ["$account.loanRepayment", 0] },
                hasSavings: { $gt: ["$account.accountBalance", 0] },
              },
            },
            {
              $group: {
                _id: null,
                totalDocuments: { $sum: 1 },
                totalActive: { $sum: { $cond: ["$isActive", 1, 0] } },
                totalWithLoan: { $sum: { $cond: ["$hasLoan", 1, 0] } },
                totalWithSavings: { $sum: { $cond: ["$hasSavings", 1, 0] } },
              },
            },
          ],
          documents: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                profile: 1,
                guarantor: 1,
                account: 1,
                organization: 1,
                socials: 1,
                education: 1,
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
          totalActive: { $arrayElemAt: ["$counts.totalActive", 0] },
          totalWithLoan: { $arrayElemAt: ["$counts.totalWithLoan", 0] },
          totalWithSavings: { $arrayElemAt: ["$counts.totalWithSavings", 0] },
          documents: {
            $map: {
              input: "$documents",
              as: "doc",
              in: {
                _id: { $toString: "$$doc._id" },
                profile: "$$doc.profile",
                guarantor: "$$doc.guarantor",
                account: "$$doc.account",
                socials: "$$doc.socials",
                organization: "$$doc.organization",
                education: "$$doc.education",
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
    const result = await UserProfile.aggregate(createPipeline());
    return result;
  } catch (error) {
    logger.error(error);
  }
}

const AdvanceFilter = async (condition) => {
  const query = {
    $and: [{ guarantor: { $exists: true } }],
  };

  for (let key in condition) {
    for (let subkey in condition[key]) {
      if (key === "profile" || key === "organization") {
        const query_key = `${key}.${subkey}`;
        query.$and.push({
          [query_key]: { $regex: condition[key][subkey], $options: "i" },
        });
      }
    }
  }

  const matchStage = {
    $match: query,
  };

  const pipeline = [
    matchStage,
    {
      $facet: {
        counts: [
          {
            $addFields: {
              isActive: { $eq: ["$profile.status", "Active"] },
              hasLoan: { $gt: ["$account.loanRepayment", 0] },
              hasSavings: { $gt: ["$account.accountBalance", 0] },
            },
          },
          {
            $group: {
              _id: null,
              totalDocuments: { $sum: 1 },
              totalActive: { $sum: { $cond: ["$isActive", 1, 0] } },
              totalWithLoan: { $sum: { $cond: ["$hasLoan", 1, 0] } },
              totalWithSavings: { $sum: { $cond: ["$hasSavings", 1, 0] } },
            },
          },
        ],
        documents: [
          {
            $project: {
              _id: 1,
              profile: 1,
              guarantor: 1,
              account: 1,
              organization: 1,
              socials: 1,
              education: 1,
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
        totalActive: { $arrayElemAt: ["$counts.totalActive", 0] },
        totalWithLoan: { $arrayElemAt: ["$counts.totalWithLoan", 0] },
        totalWithSavings: { $arrayElemAt: ["$counts.totalWithSavings", 0] },
        documents: {
          $map: {
            input: "$documents",
            as: "doc",
            in: {
              _id: { $toString: "$$doc._id" },
              profile: "$$doc.profile",
              guarantor: "$$doc.guarantor",
              account: "$$doc.account",
              socials: "$$doc.socials",
              organization: "$$doc.organization",
              education: "$$doc.education",
              createdAt: "$$doc.createdAt",
            },
          },
        },
      },
    },
  ];
  return await UserProfile.aggregate(pipeline);
};

module.exports = { Search, AdvanceFilter };
