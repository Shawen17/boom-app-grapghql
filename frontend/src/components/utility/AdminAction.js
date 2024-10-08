export const StatusUpdate = async (action, status, email) => {
  var result;

  if (status === "blacklist") {
    result = "Blacklisted";
  } else if (status === "activate") {
    result = "Active";
  }
  const token = localStorage.getItem("access");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const mutation = `
      mutation UpdateStatus($email: String!,$status:String!) {
        updateStatus(email: $email,status:$status){
          _id
        }
      }  
    `;

  const variables = {
    email: email,
    status: result,
  };

  const body = JSON.stringify({
    query: mutation,
    variables: variables,
  });

  try {
    const res = await action.post(
      "http://localhost:9000/graphql",
      body,
      config
    );
    alert(`userID : ${res.data.data.updateStatus._id} status ${result}`);
  } catch (error) {
    alert(error.message);
  }
};

export const LoanUpdate = async (action, status, email) => {
  var result;

  if (status === "reject") {
    result = "Rejected";
  } else if (status === "approve") {
    result = "Active";
  }

  const token = localStorage.getItem("access");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const mutation = `
      mutation UpdateLoanStatus($email: String!,$status:String!) {
        updateLoanStatus(email: $email,status:$status){
          _id
        }
      }  
    `;

  const variables = {
    email: email,
    status: result,
  };

  const body = JSON.stringify({
    query: mutation,
    variables: variables,
  });

  try {
    const res = await action.post(
      "http://localhost:9000/graphql",
      body,
      config
    );
    alert(`LoanID : ${res.data.data.updateLoanStatus._id} status ${result}`);
  } catch (error) {
    alert(error.message);
  }
};

export const mergeFields = (obj, keysToSearch) => {
  const result = {};

  for (const key in obj) {
    if (
      keysToSearch.some(
        (searchKey) =>
          key.includes(searchKey) &&
          (obj[key] !== undefined || obj[key] !== null)
      )
    ) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const banks = [
  { id: 0, name: "" },
  { id: 1, name: "Access" },
  { id: 2, name: "Citibank" },
  { id: 3, name: "Ecobank" },
  { id: 4, name: "Fidelity" },
  { id: 5, name: "First Bank" },
  { id: 6, name: "FCMB" },
  { id: 7, name: "Globus" },
  { id: 8, name: "GTB" },
  { id: 9, name: "Heritage" },
  { id: 10, name: "Keystone" },
  { id: 11, name: "Optimus" },
  { id: 12, name: "Parallex" },
  { id: 13, name: "Polaris" },
  { id: 14, name: "Premium Trust" },
  { id: 15, name: "Providus" },
  { id: 16, name: "Signature" },
  { id: 17, name: "Stanbic IBTC" },
  { id: 18, name: "Standard Chartered" },
  { id: 19, name: "Sterling" },
  { id: 20, name: "SunTrust" },
  { id: 21, name: "Titan Trust" },
  { id: 22, name: "Union" },
  { id: 23, name: "UBA" },
  { id: 24, name: "Unity Bank" },
  { id: 25, name: "Wema" },
  { id: 26, name: "Zenith" },
];

export const sectors = [
  { id: 0, name: "" },
  { id: 1, name: "Fintech" },
  { id: 2, name: "Manufacturing" },
  { id: 3, name: "Software" },
  { id: 4, name: "Telecommunications" },
  { id: 5, name: "Banking" },
  { id: 6, name: "Construction" },
  { id: 7, name: "Hospitality" },
  { id: 8, name: "Medical" },
  { id: 9, name: "Trading" },
];

export const relationships = [
  { id: 0, name: "" },
  { id: 1, name: "Sibling" },
  { id: 2, name: "Cousin" },
  { id: 3, name: "Parent" },
  { id: 4, name: "Uncle" },
  { id: 5, name: "Son" },
  { id: 6, name: "Daugther" },
  { id: 7, name: "Spouse" },
  { id: 8, name: "Colleague" },
  { id: 9, name: "Aunty" },
];

export const provinces = [
  { id: 0, name: "" },
  { id: 1, name: "Alberta" },
  { id: 2, name: "British Columbia" },
  { id: 3, name: "Manitoba" },
  { id: 4, name: "New Brunswick" },
  { id: 5, name: "Newfoundland and Labrador" },
  { id: 6, name: "Nova Scotia" },
  { id: 7, name: "Nunavut" },
  { id: 8, name: "Ontario" },
  { id: 9, name: "Prince Edward Island" },
  { id: 10, name: "Quebec" },
  { id: 11, name: "Saskatchewan" },
  { id: 12, name: "Yukon" },
  { id: 13, name: "Northwest Territories" },
];
