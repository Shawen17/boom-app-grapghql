import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import { MoreVertOutlined, FilterListOutlined } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { PageButton, Pagination as Paginate } from "../Styled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { LoanUpdate } from "../utility/AdminAction";
import axios from "axios";

import { UserContext } from "../utility/ContextManager";

const AllLoans = (props) => {
  const PageSize = props.PageSize;
  const [menu, setMenu] = useState();
  const [submenu, setSubmenu] = useState(false);
  const data = useContext(UserContext);
  const [result, setResult] = useState(data);

  const navigate = useNavigate();

  useEffect(() => {
    setResult(data);
  }, [data]);

  const displayDetails = (person, path) => {
    setMenu();
    navigate(path, { state: person });
  };

  const UpdateProfile = (email, status) => {
    LoanUpdate(axios, status, email);
    props.updateStatus();
  };

  const displayMenu = (index) => {
    setMenu(index);
  };

  const customStatus = (status) => {
    if (status === "Active") {
      return <span id="active-status">Active</span>;
    } else if (status === "Completed") {
      return <span id="inactive-status">Completed</span>;
    } else if (status === "Pending") {
      return <span id="pending-status">Pending</span>;
    } else if (status === "Recovery") {
      return <span id="blacklisted-status">Recovery</span>;
    } else if (status === "Rejected") {
      return <span id="blacklisted-status">Rejected</span>;
    }
  };

  const formatDate = (str) => {
    let date = new Date(str);
    return date.toDateString();
  };

  return (
    <div style={{ borderRadius: "6px", backgroundColor: "white" }}>
      <Table borderless style={{ position: "relative", maxWidth: "100vw" }}>
        <thead>
          <tr>
            <th>
              FIRSTNAME <FilterListOutlined />{" "}
            </th>
            <th>
              LASTNAME <FilterListOutlined />
            </th>
            <th>
              EMAIL <FilterListOutlined />
            </th>
            <th>
              PHONE NUMBER <FilterListOutlined />
            </th>
            <th>
              AMOUNT <FilterListOutlined />
            </th>
            <th>
              DURATION <FilterListOutlined />
            </th>
            <th>
              DATE REQUESTED <FilterListOutlined />
            </th>
            <th>
              LOAN STATUS <FilterListOutlined />
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {result.loans_paginated.map((user, index) => {
            return (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #ccc",
                  height: "60px",
                  opacity: 1,
                  justifyContent: "center",
                }}
              >
                <td
                  className="nav-link sidebar-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => displayDetails(user, "/update-loan")}
                >
                  {user.loan.firstName}
                </td>
                <td>{user.loan.lastName}</td>
                <td>{user.loan.email}</td>
                <td>{user.loan.phoneNumber}</td>
                <td>{user.loan.amount}</td>
                <td>{user.loan.duration}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{customStatus(user.loan.loanStatus)}</td>
                <td>
                  <button
                    onClick={() => {
                      displayMenu(index);
                      setSubmenu(!submenu);
                    }}
                    style={{ border: "none", backgroundColor: "white" }}
                  >
                    <MoreVertOutlined className="menu-bar" />
                    <ul
                      className={
                        menu === index && submenu
                          ? "show-menu-options"
                          : "hide-menu-options"
                      }
                    >
                      <li
                        onClick={() => {
                          displayDetails(user, "/loan-details");
                        }}
                      >
                        View Details
                      </li>
                      <li
                        onClick={() => {
                          UpdateProfile(user.loan.email, "reject");
                        }}
                      >
                        Reject
                      </li>
                      <li
                        onClick={() => {
                          UpdateProfile(user.loan.email, "approve");
                        }}
                      >
                        Approve
                      </li>
                    </ul>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Paginate>
        <PageButton onClick={() => props.prevPage()}>
          <ArrowBackIosIcon />
        </PageButton>
        <PageButton onClick={() => props.nextPage()}>
          <ArrowForwardIosIcon />
        </PageButton>
        <div>
          {props.page} of {Math.ceil(result.all_loans / PageSize)}...
        </div>
      </Paginate>
    </div>
  );
};

export default React.memo(AllLoans);
