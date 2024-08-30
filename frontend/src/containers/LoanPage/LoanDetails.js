import { useState } from "react";
import { KeyboardBackspaceOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import SideBar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import { useLocation } from "react-router-dom";
import { LoanUpdate } from "../../components/utility/AdminAction";
import axios from "axios";

import { motion } from "framer-motion";
import {
  UserActionButton,
  UserAction,
  Right,
  Left,
  Container,
  Info,
  Wrapper,
  VerticalLine,
  InfoWrapper,
  PersonalInfo,
  Header,
  HeaderValue,
} from "../../components/menu/StyledMenu";

const LoanDetails = () => {
  window.title = "Loan-details";
  const location = useLocation();
  const user = location.state;

  const [display, setDisplay] = useState(false);

  const onMenuClick = () => {
    setDisplay(!display);
  };

  const formatDate = (input) => {
    const date = new Date(input);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Container>
        <Left className={display ? "appear" : "disappear"}>
          <SideBar />
        </Left>
        <Right>
          <NavBar onMenuClick={onMenuClick} />
          <div
            style={{
              backgroundColor: "whitesmoke",
              marginTop: "10px",
              height: "100%",
            }}
          >
            <Link className="dashboard-link" to="/loan-dashboard">
              <KeyboardBackspaceOutlined className="menu-bar" />
              <span>Back to Users</span>
            </Link>
            <UserAction>
              <h3 style={{ color: "#00308f" }}>Loan Details</h3>
              <UserActionButton
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  LoanUpdate(axios, "reject", user.loan.email);
                }}
                color="red"
              >
                REJECT
              </UserActionButton>
              <UserActionButton
                onClick={() => {
                  LoanUpdate(axios, "approve", user.loan.email);
                }}
                color="aqua"
              >
                APPROVE
              </UserActionButton>
            </UserAction>
            <Info>
              <Wrapper style={{ justifyContent: "center" }}>
                <div className="info" style={{ margin: 10 }}>
                  <h3>{`${user.loan.firstName} ${user.loan.lastName}`}</h3>
                </div>
                <VerticalLine className="info-v" />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    margin: 10,
                  }}
                >
                  <p className="acc-bal-p">
                    ₦{user.account ? user.loan.loanRepayment : 0}
                  </p>
                  <div
                    style={{
                      fontSize: "12px",
                      fontFamily: "Work Sans",
                      fontStyle: "normal",
                      fontWeight: 400,
                      direction: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {`${user.account ? user.account.accountNumber : ""}/${
                      user.account ? user.account.bank : ""
                    }`}
                  </div>
                </div>
              </Wrapper>
            </Info>
            <InfoWrapper>
              <PersonalInfo>
                <Header>Date Requested</Header>
                <HeaderValue>{formatDate(user.createdAt)}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Amount</Header>
                <HeaderValue>{`₦${parseFloat(
                  user.loan.amount
                ).toLocaleString()}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Duration</Header>
                <HeaderValue>{`${user.loan.duration} months`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Loan Repayment</Header>
                <HeaderValue>{`₦${parseFloat(
                  user.loan.loanRepayment
                ).toLocaleString()}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Bank</Header>
                <HeaderValue>{user.loan.bank}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Account Number</Header>
                <HeaderValue>{user.account.accountNumber}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Approval Status</Header>
                <HeaderValue>{user.loan.loanStatus}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Name</Header>
                <HeaderValue>{`${user.guarantor.guaFirstName}  ${user.guarantor.guaLastName}`}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Number</Header>
                <HeaderValue>{user.guarantor.guaNumber}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Gender</Header>
                <HeaderValue>{user.guarantor.guaGender}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Relationship</Header>
                <HeaderValue>{user.guarantor.relationship}</HeaderValue>
              </PersonalInfo>
              <PersonalInfo>
                <Header>Guarantor's Address</Header>
                <HeaderValue>{user.guarantor.guaAddress}</HeaderValue>
              </PersonalInfo>
            </InfoWrapper>
          </div>
        </Right>
      </Container>
    </motion.div>
  );
};

export default LoanDetails;
