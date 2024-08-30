import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import { MoreVertOutlined, FilterListOutlined } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import FilterForm from "./FilterForm";
import { PageButton, Pagination as Paginate } from "./Styled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StatusUpdate } from "./utility/AdminAction";
import axios from "axios";
import { mergeFields } from "./utility/AdminAction";
import { UserContext } from "./utility/ContextManager";

const Users = (props) => {
  const PageSize = props.PageSize;
  const [menu, setMenu] = useState();
  const [submenu, setSubmenu] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [inputs, setInputs] = useState({});
  const data = useContext(UserContext);
  const [result, setResult] = useState(data);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [filtered, setFiltered] = useState(0);
  const [error, setError] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const profileKeys = ["userName", "status", "email", "phoneNumber"];
    const organizationKeys = ["orgName"];
    const profile = mergeFields(inputs, profileKeys);
    const organization = mergeFields(inputs, organizationKeys);

    const token = localStorage.getItem("access");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const query = `
      query AdvancedFilter($profile: ProfileInput,$organization:OrganizationInput) {
        advancedFilter(profile: $profile,organization: $organization){
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
      profile: profile,
      organization: organization,
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
        if (res.data.errors) setError(res.data.errors);

        setResult(res.data.data.advancedFilter);
      } catch (err) {
        setError(err.message);
      }
    };
    if (clicked && filtered) {
      fetchProfiles();
    } else {
      setResult(data);
    }
  }, [filtered, inputs, clicked, data]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const onFilter = () => {
    setFiltered(filtered + 1);
  };

  const onReset = () => {
    setInputs({});
    setFiltered(0);
    setResult(data);
  };

  const filterClick = (event) => {
    setPosition({ top: event.pageY + 20, left: event.pageX - 30 });
    setClicked(!clicked);
    if (clicked) {
      onReset();
    }
  };

  const displayDetails = (person, path) => {
    setMenu();
    navigate(path, { state: person });
  };

  const UpdateProfile = (email, status) => {
    StatusUpdate(axios, status, email);
    props.updateStatus();
  };

  const displayMenu = (index) => {
    setMenu(index);
  };

  const customStatus = (status) => {
    if (status === "Active") {
      return <span id="active-status">Active</span>;
    } else if (status === "Inactive") {
      return <span id="inactive-status">Inactive</span>;
    } else if (status === "Pending") {
      return <span id="pending-status">Pending</span>;
    } else if (status === "Blacklisted") {
      return <span id="blacklisted-status">Blacklisted</span>;
    }
  };

  const formatDate = (str) => {
    let date = new Date(str);
    return date.toDateString();
  };

  return (
    <div style={{ borderRadius: "6px", backgroundColor: "white" }}>
      {clicked ? (
        <FilterForm
          handleChange={handleChange}
          onFilter={onFilter}
          onReset={onReset}
          inputs={inputs}
          style={position}
        />
      ) : (
        ""
      )}

      <Table borderless style={{ position: "relative", maxWidth: "100vw" }}>
        <thead>
          <tr>
            <th onClick={filterClick}>
              ORGANIZATION <FilterListOutlined />{" "}
            </th>
            <th onClick={filterClick}>
              USERNAME <FilterListOutlined />
            </th>
            <th onClick={filterClick}>
              EMAIL <FilterListOutlined />
            </th>
            <th onClick={filterClick}>
              PHONE NUMBER <FilterListOutlined />
            </th>
            <th onClick={filterClick}>
              DATE JOINED <FilterListOutlined />
            </th>
            <th onClick={filterClick}>
              STATUS <FilterListOutlined />
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {error
            ? error
            : result.users_paginated.map((user, index) => {
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
                      onClick={() => displayDetails(user, "/update-profile")}
                    >
                      {user.organization.orgName}
                    </td>
                    <td>{user.profile.userName}</td>
                    <td>{user.profile.email}</td>
                    <td>{user.profile.phoneNumber}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{customStatus(user.profile.status)}</td>
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
                              displayDetails(user, "/user-details");
                            }}
                          >
                            View Details
                          </li>
                          <li
                            onClick={() => {
                              UpdateProfile(user.profile.email, "blacklist");
                            }}
                          >
                            Blacklist
                          </li>
                          <li
                            onClick={() => {
                              UpdateProfile(user.profile.email, "activate");
                            }}
                          >
                            Activate
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
          {props.page} of {Math.ceil(props.totalCount / PageSize)}...
        </div>
      </Paginate>
    </div>
  );
};

export default React.memo(Users);
