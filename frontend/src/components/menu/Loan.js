import {
  Details,
  InfoWrapper,
  PersonalInfo,
  Header,
  HeaderValue,
  HorizontalLine,
} from "./StyledMenu";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetch_loan } from "../../action/auth";

const Loan = ({ user, fetch_loan }) => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  const formatDate = (input) => {
    const date = new Date(input);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    const fetchAndSetLoan = async () => {
      try {
        const { result, failed } = await fetch_loan(user.profile.email);
        failed ? setError(failed) : setLoans(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAndSetLoan();
  }, [user.profile.email, fetch_loan]);

  return (
    <Details>
      <p
        style={{
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: "bold",
          lineHeight: "19px",
          margin: "20px 20px",
        }}
      >
        Loan History
      </p>
      {error ? (
        error
      ) : loans.length > 0 ? (
        loans.map((loan) => (
          <div key={loan._id}>
            <InfoWrapper>
              <PersonalInfo>
                <Header>Date Requested</Header>
                <HeaderValue>{formatDate(loan.createdAt)}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Amount</Header>
                <HeaderValue>{`₦${parseFloat(
                  loan.loan.amount
                ).toLocaleString()}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Duration</Header>
                <HeaderValue>{`${loan.loan.duration} months`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Repayment</Header>
                <HeaderValue>{`₦${parseFloat(
                  loan.loan.loanRepayment
                ).toLocaleString()}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Bank</Header>
                <HeaderValue>{loan.loan.bank}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Account Number</Header>
                <HeaderValue>{loan.account.accountNumber}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Approval Status</Header>
                <HeaderValue>{loan.loan.loanStatus}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Name</Header>
                <HeaderValue>{`${loan.guarantor.guaFirstName}  ${loan.guarantor.guaLastName}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Number</Header>
                <HeaderValue>{loan.guarantor.guaNumber}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Gender</Header>
                <HeaderValue>{loan.guarantor.guaGender}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Relationship</Header>
                <HeaderValue>{loan.guarantor.relationship}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Address</Header>
                <HeaderValue>{loan.guarantor.guaAddress}</HeaderValue>
              </PersonalInfo>
            </InfoWrapper>
            <HorizontalLine />
          </div>
        ))
      ) : (
        <p style={{ paddingLeft: 10 }}>Yet to Take Any Loan</p>
      )}
    </Details>
  );
};

export default connect(null, { fetch_loan })(Loan);
