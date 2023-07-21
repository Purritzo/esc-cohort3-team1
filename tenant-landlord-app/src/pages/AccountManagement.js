// Import react-bootstrap components

import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";
import { useEffect } from 'react';

// Import React and hooks
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import NavigationBar from '../components/NavigationBar';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, TableContainer, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
Box, AccordionIcon, HStack, Flex } from '@chakra-ui/react';

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
import React, { useState } from "react";
// import TableStyles from "../styles/signup_form_landlord.module.css";
import TableStyles from "../styles/account_management.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";

const AccountManagement = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const [tenantAccounts, setTenantAccounts] = useState(null)

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
      //passwordShown = true if handler is invoked  
      setPasswordShown(!passwordShown)
    }

    const APIGetTenantAccounts = async () => {
    const response = await axios.get(
        "http://localhost:5000/api/landlord/getTenantAccounts",
    )
    //console.log(response)
    return response
    }

    const GetTenantAccounts = () => {
    var temp_accounts = []
    const accounts = APIGetTenantAccounts()
    accounts.then((result) => {
        if (result !== undefined){
        for (let i=0;i<result.data.data.length;i++){
            temp_accounts.push(result.data.data[i]);
        }
    }
    console.log(temp_accounts)
    // account.email
    const accounts_table = (
        <TableContainer>
          <Table variant='simple'>
            <Tbody>
              {temp_accounts.map((account) => (
                <Tr key={account.tenant_user_id}>
                  <Td>{account.tenant_user_id}</Td>
                  <Td>{account.email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );
    
    setTenantAccounts(accounts_table) 
    })}

  const onSubmit = async (values) => {
    console.log("Values: ", values);
    setError("");

    try{
        const response = await axios.post(
            "http://localhost:5000/api/landlord/createTenant",
            values
        )
        //console.log(response);
        signIn({
            token: response.data.token,
            expiresIn: 60,
            tokenType: "Bearer",
            authState: {email: values.email}
        });
        if (response.data.message === "created successfully"){
            navigateToDashboard();
        }



    } catch (err){
        if (err && err instanceof AxiosError) {
            setError(err.response?.data.message);
        }
        else if (err && err instanceof Error){
            setError(err.message);
        }

        console.log("Error: ", err);
    }
    window.location.reload();
  }

  const navigateToDashboard = () => {
    navigate('/pages/Dashboard');
  };

  const formik = useFormik({
    initialValues: {
        email: "",
        password: "",
    },
    onSubmit,
  });

  useEffect(() => {
    GetTenantAccounts()},
    [])
  return (
    <div className={TableStyles.pageWrapper}>
      <div className={TableStyles.page}>
        <form className={TableStyles.cover} onSubmit={formik.handleSubmit}>
          <h1 className={TableStyles.header}>Register</h1>
          <div className={TableStyles.context}>sign up as a landlord</div>
          <input
            name="email"
            type="email"
            className={TableStyles.input}
            placeholder="EMAIL"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <div className={TableStyles.passwordToggle}>
            <input
              name="password"
              type={passwordShown ? "text" : "password"}
              placeholder="PASSWORD"
              className={TableStyles.passwordInput}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <span onClick={togglePassword}>
              {passwordShown ? "Hide" : "Show"}
            </span>
          </div>
          <button
            className={TableStyles.next_btn}
            type="submit"
            isLoading={formik.isSubmitting}
          >
            FINISH
          </button>
        </form>
      </div>

      <div className={TableStyles.container}>
        <h2>Your Tenants</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Requester</th>
            </tr>
          </thead>
          <tbody>
            {tenantAccounts}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AccountManagement