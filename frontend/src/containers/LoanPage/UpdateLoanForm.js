import { useEffect, useState } from "react";
import { banks, relationships } from "../../components/utility/AdminAction";
import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "reactstrap";
import axios from "axios";

import {
  Wrapper,
  Container,
  Label,
  Input,
  SearchContainer,
  Button,
  FormDisplay,
  Title,
  Select,
  Box,
  MiniContainer,
  Back,
} from "../../components/Styled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const UpdateLoanForm = () => {
  document.title = "update loan profile";
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {}, [inputs.accountBalance]);

  const Handleback = () => {
    navigate(-1);
  };

  const handleChange = (event) => {
    setError("");
    setMsg("");

    const { name, value } = event.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("access");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const mutation = `
      mutation AdminLoanUpdate($email: String!,$loanRepayment:Float!) {
        adminLoanUpdate(email: $email,loanRepayment:$loanRepayment)
      }  
    `;

    const variables = {
      email: user.loan.email,
      loanRepayment: +inputs.loanRepayment,
    };

    const body = JSON.stringify({
      query: mutation,
      variables: variables,
    });

    try {
      await axios.post("http://localhost:9000/graphql", body, config);
      setMsg("Updated Successfully");
    } catch (error) {
      setError(error.message);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formDisplay = {
    width: "100%",
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
        <Title>Update Loan Profile</Title>
        <Back>
          <ArrowBackIcon onClick={() => Handleback()} />
        </Back>
        <p style={{ color: "red" }}>{error}</p>
        <p>{msg}</p>

        <FormDisplay>
          <Form
            style={formDisplay}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <Label style={{ fontWeight: "bold" }}>Loan Info</Label>
            <Wrapper>
              <MiniContainer>
                <Box>
                  <Label htmlFor="amount">Loan Amount</Label>
                  <SearchContainer>
                    <Input
                      placeholder="between 50k-3million"
                      type="number"
                      name="amount"
                      defaultValue={user.loan.amount}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="duration">Loan Duration</Label>
                  <SearchContainer>
                    <Input
                      placeholder="in months e.g 11"
                      type="number"
                      name="duration"
                      defaultValue={user.loan.duration}
                      readOnly
                    />
                  </SearchContainer>
                </Box>

                <Box>
                  <Label htmlFor="bank">Bank</Label>
                  <SearchContainer>
                    <Select name="bank" defaultValue={user.loan.bank} readOnly>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.name}>
                          {bank.name}
                        </option>
                      ))}
                    </Select>
                  </SearchContainer>
                </Box>

                <Box>
                  <Label htmlFor="loanRepayment">Loan Repayment</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Loan Repayment"
                      type="number"
                      step="0.01"
                      name="loanRepayment"
                      value={inputs.loanRepayment || user.loan.loanRepayment}
                      onChange={handleChange}
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="minimumIncome">Minimum Income</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Minimum Income"
                      type="number"
                      step="0.01"
                      name="minimumIncome"
                      defaultValue={user.account.monthlyIncome[0]}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="maximumIncome">Maximun Income</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Maximum Income"
                      type="number"
                      step="0.01"
                      name="maximumIncome"
                      defaultValue={user.account.monthlyIncome[1]}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
              </MiniContainer>
            </Wrapper>

            <Label style={{ fontWeight: "bold" }}>Guarantor</Label>
            <Wrapper>
              <MiniContainer>
                <Box>
                  <Label htmlFor="guaFirstName">First Name</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Guarantor's First name"
                      type="text"
                      name="guaFirstName"
                      defaultValue={user.guarantor.guaFirstName}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="guaLastName">Last Name</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Gurantor's Last name"
                      type="text"
                      name="guaLastName"
                      defaultValue={user.guarantor.guaLastName}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="guaNumber">Phone Number</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Guarantor's Number"
                      type="text"
                      name="guaNumber"
                      defaultValue={user.guarantor.guaNumber}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="guaAddress">Address</Label>
                  <SearchContainer>
                    <Input
                      placeholder="Guarantor's Address"
                      type="text"
                      name="guaAddress"
                      value={user.guarantor.guaAddress}
                      readOnly
                    />
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="guaGender">Gender</Label>
                  <SearchContainer>
                    <Select
                      name="guaGender"
                      defaultValue={user.guarantor.guaGender}
                      readOnly
                    >
                      <option value="others"></option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </SearchContainer>
                </Box>
                <Box>
                  <Label htmlFor="relationship">Relationship</Label>
                  <SearchContainer>
                    <Select
                      name="relationship"
                      defaultValue={user.guarantor.relationship}
                      readOnly
                    >
                      {relationships.map((relationship) => (
                        <option key={relationship.id} value={relationship.name}>
                          {relationship.name}
                        </option>
                      ))}
                    </Select>
                  </SearchContainer>
                </Box>
              </MiniContainer>
            </Wrapper>

            <Button type="submit">Submit</Button>
          </Form>
        </FormDisplay>
      </Container>
    </motion.div>
  );
};

export default UpdateLoanForm;
