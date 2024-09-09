import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import { PageButton, Pagination as Paginate } from "./Styled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { UserContext } from "./utility/ContextManager";

const Guarantors = (props) => {
  const PageSize = props.PageSize;
  const data = useContext(UserContext);
  const [result, setResult] = useState(data);

  useEffect(() => {
    setResult(data);
  }, [data]);

  return (
    <div style={{ borderRadius: "6px", backgroundColor: "white" }}>
      <Table borderless style={{ position: "relative", maxWidth: "100vw" }}>
        <thead>
          <tr>
            <th>NAME</th>
            <th>PHONE NUMBER</th>
            <th>GENDER</th>
            <th>RELATIONSHIP</th>
            <th>CUSTOMER</th>
            <th>ADDRESS</th>
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
                <td>{`${user.guarantor.guaFirstName} ${user.guarantor.guaLastName}`}</td>
                <td>{user.guarantor.guaNumber}</td>
                <td>{user.guarantor.guaGender}</td>
                <td>{user.guarantor.relationship}</td>
                <td>{`${user.loan.firstName} ${user.loan.lastName}`}</td>
                <td>{user.guarantor.guaAddress}</td>
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

export default React.memo(Guarantors);
