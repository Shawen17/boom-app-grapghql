import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideBar from "../../components/SideBar";
import Guarantors from "../../components/Guarantors";
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

let PageSize = 20;

const GuarantorPage = ({ logout }) => {
  window.title = "Guarantors";

  const [searchValue, setSearchValue] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");

  const [raw, setRaw] = useState({
    items: {
      loans_paginated: [],
      all_loans: 0,
    },
  });

  const [display, setDisplay] = useState(false);

  const onMenuClick = () => {
    setDisplay(!display);
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
      query AllLoans($page: Int!,$limit:Int!,$search:String) {
        getAllLoans(page: $page,limit: $limit,search: $search){
          all_loans,
          loans_paginated{
              loan{
                firstName
                lastName
                },
                
              guarantor{
                  guaAddress
                  guaFirstName
                  guaLastName
                  guaGender
                  guaNumber
                  relationship
                },
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

    const fetchLoans = async () => {
      try {
        const res = await axios.post(
          "http://localhost:9000/graphql",
          body,
          config
        );
        setModal(false);
        setRaw({ items: res.data.data.getAllLoans });
      } catch (err) {
        setModal(false);
        logout();
        setError(err.message);
      }
    };

    fetchLoans();
  }, [page, logout, searchValue]);

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
                Guarantors
              </h3>

              {error}
              {modal ? Loading() : ""}
              <Guarantors
                page={page}
                PageSize={PageSize}
                prevPage={prevPage}
                nextPage={nextPage}
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

export default connect(null, mapDispatchToProps)(React.memo(GuarantorPage));
