import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideBar from "../../components/SideBar";
import Users from "../../components/Users";
import NavBar from "../../components/NavBar";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../../components/Loading";
import { logout } from "../../action/auth";
import { connect } from "react-redux";
import { UserContext } from "../../components/utility/ContextManager";

const Container = styled.div`
  padding: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  overflow-x: hidden;
  @media screen and (max-width: 568px) {
    overflow-x: auto;
  }
`;

const Left = styled.div`
  position: relative;
`;

const Right = styled.div`
  width: 75%;
  @media screen and (max-width: 568px) {
    width: 100%;
    margin: 5px;
  }
`;

const Dashstats = styled.div`
margin-left:0px;
margin-bottom:20px;
margin-top:20px;
display:flex;
align:items:center;
justify-content:center;
flex-wrap:wrap;
padding:10px;
flex:12;
@media screen and (min-width:0px) and (max-width:568px){
    flex-wrap:nowrap;
    flex-basis:24%;
}
`;

const Stats = styled.div`
  background-color: white;
  height: 160px;
  width: 240px;
  border: 1px solid rgba(33, 63, 125, 0.06);
  box-shadow: 3px 5px 20px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  flex: 3;
  justify-content: flex-start;
  align-items: left;
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 12px 10px;
`;

const StatIcon = styled.img`
  height: 25%;
  width: 25%;
  border-radius: 50%;
`;

const StatDesc = styled.h5`
  font-family: "Work Sans";
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #0050b5;
  margin-top: 5px;
`;
const StatNum = styled.h5`
  font-family: "Work Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  text-transform: uppercase;
  margin-top: 3px;
  color: #0050b5;
  opacity: 1;
`;

let PageSize = 20;

const Dashboard = ({ logout }) => {
  window.title = "Dashboard";

  const [searchValue, setSearchValue] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [statusUpated, setStatusUpdated] = useState(false);
  const [raw, setRaw] = useState({
    items: {
      users_paginated: [],
      all_users: 0,
      active: 0,
      loan: 0,
      savings: 0,
      createdAt: 0,
    },
  });

  const [display, setDisplay] = useState(false);

  const onMenuClick = () => {
    setDisplay(!display);
  };

  const updateStatus = () => {
    setStatusUpdated(!statusUpated);
  };

  const nextPage = () => {
    if (page < Math.ceil(raw.items.all_users / PageSize)) {
      setModal(true);
      setPage(page + 1);
    }
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const prevPage = () => {
    if (page > 1) {
      setModal(true);
      setPage(page - 1);
    }
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const HandleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    var search = "";
    let index = page;
    if (searchValue.length > 4) {
      search = searchValue;
      index = 1;
    }

    const query = `
      query GetProfiles($page: Int!,$limit:Int!,$search:String) {
        getUsers(page: $page,limit: $limit,search: $search){
          all_users,
          active,
          loan,
          savings,
          users_paginated{
              profile{
                  firstName
                  lastName
                  phoneNumber
                  gender
                  bvn
                  address
                  currency
                  email
                  userName
                  status
                  avatar
              },
              socials{
                  facebook
                  twitter
                  instagram
              },
              organization{
                  orgName
                  orgNumber
                  officeEmail
                  employmentStatus
                  sector
                  duration
              },
              education{
                  level
              },
              account{
                  accountName
                  accountBalance
                  accountNumber
                  bank
                  monthlyIncome
                },
              guarantor{
                  guaAddress
                  guaFirstName
                  guaLastName
                  guaGender
                  guaNumber
                  relationship
              },
              createdAt
          }

        }
      }  
    `;

    const variables = {
      page: index,
      limit: PageSize,
      search: search,
    };

    const body = JSON.stringify({
      query: query,
      variables: variables,
    });

    const fetchProfiles = async () => {
      try {
        const res = await axios.post(
          "http://localhost:9000/graphql",
          body,
          config
        );
        setModal(false);
        setRaw({ items: res.data.data.getUsers });
      } catch (err) {
        setModal(false);
        logout();
        setError(err);
      }
    };

    fetchProfiles();
  }, [page, logout, searchValue, statusUpated]);

  return (
    <UserContext.Provider value={raw.items}>
      <motion.div
        initial={{ scale: 0.8 }}
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
            <NavBar
              searchValue={searchValue}
              HandleInputChange={HandleInputChange}
              onMenuClick={onMenuClick}
            />
            <div style={{ backgroundColor: "whitesmoke" }}>
              <h3
                style={{
                  color: "#0050B5",
                  marginLeft: "10px",
                  paddingTop: "25px",
                }}
              >
                Users
              </h3>
              <Dashstats>
                <Stats>
                  <StatIcon src="/static/icons/user.png" alt="user" />
                  <StatDesc>users</StatDesc>
                  <StatNum>{raw.items.all_users}</StatNum>
                </Stats>
                <Stats>
                  <StatIcon
                    src="/static/icons/user_active.png"
                    alt="active icon"
                  />
                  <StatDesc>ACTIVE USERS</StatDesc>
                  <StatNum>{raw.items.active}</StatNum>
                </Stats>
                <Stats>
                  <StatIcon src="/static/icons/user_loan.png" alt="loan icon" />
                  <StatDesc>USERS WITH LOANS</StatDesc>
                  <StatNum>{raw.items.loan}</StatNum>
                </Stats>
                <Stats>
                  <StatIcon
                    src="/static/icons/user_savings.png"
                    alt="savings icon"
                  />
                  <StatDesc>USERS WITH SAVINGS</StatDesc>
                  <StatNum>{raw.items.savings}</StatNum>
                </Stats>
              </Dashstats>
              {error}
              {modal ? Loading() : ""}
              <Users
                page={page}
                PageSize={PageSize}
                totalCount={raw.items.all_users}
                prevPage={prevPage}
                nextPage={nextPage}
                currentData={raw.items.users_paginated}
                updateStatus={updateStatus}
              />
            </div>
          </Right>
        </Container>
      </motion.div>
    </UserContext.Provider>
  );
};
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(React.memo(Dashboard));
