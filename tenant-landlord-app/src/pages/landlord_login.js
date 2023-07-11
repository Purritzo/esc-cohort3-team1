import React, { useState } from "react";
import LoginStyles from "../styles/login_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import {Link} from 'react-router-dom';
import {Link as ReactLink} from "@react/router"
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Heading,
    Center,
    Text,
} from "@chakra-ui/react";

const LandlordLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
      }

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try{
            const response = await axios.post(
                //api to be added
                "http://localhost:3000/login",
                values
            )
        } catch (err){
            if (err && err instanceof AxiosError) {
                setError(err.response?.data.message);
            }
            else if (err && err instanceof Error){
                setError(err.message);
            }

            console.log("Error: ", err);
        }

        

    }
  
    const navigateToDashboard = () => {
      navigate('/pages/Dashboard');
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            // rememberMe: false
        },
        onSubmit,
    });

    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Box w="22em" h="30em" p={6} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
                <form onSubmit={formik.handleSubmit}>
                    <VStack spacing={6} align="flex-start" alignItems="center">
                        <Heading marginTop={10}>Welcome!</Heading>
                        <FormControl >
                            <Input
                                id="email" 
                                name="email"
                                type="email" 
                                variant="filled"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <InputGroup size='md'>
                                <Input
                                    id="password"
                                    name="password" 
                                    pr='4.5rem'
                                    type={passwordShown ? "text" : "password"} 
                                    placeholder="Password"
                                    variant="filled"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h='1.75rem' size='sm' onClick={togglePassword}  variant="unstyled">
                                        {passwordShown ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button 
                            type="submit" 
                            isLoading={formik.isSubmitting} 
                            backgroundColor="rgb(192, 17, 55)" 
                            width="full" 
                            textColor="white" 
                            variant="unstyled"
                            > 
                            LOGIN
                        </Button>
                        <Box fontSize="lg" textColor="blue.700">
                            <Link to="/pages/landlord_signup" as={ReactLink}>Don't have an account?</Link>
                        </Box>
                        <Box fontSize="lg" textColor="blue.700">
                            <Link >forget password?</Link>
                        </Box>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
    )

    // return (
    //     <div className={LoginStyles.page}>
    //         <form className={LoginStyles.cover} onSubmit={formik.handleSubmit}>
    //             <h1 className={LoginStyles.header}>Welcome!</h1>
    //             <input 
    //                 name="email"
    //                 type="email" 
    //                 className={LoginStyles.input} 
    //                 placeholder="EMAIL" 
    //                 value={formik.values.email}
    //                 onChange={formik.handleChange}
    //                 />
    //             <div className={PasswordStyles.passwordToggle}>
    //                 <input
    //                     name="password" 
    //                     type={passwordShown ? "text" : "password"} 
    //                     placeholder="PASSWORD"
    //                     className={PasswordStyles.passwordInput}
    //                     value={formik.values.password}
    //                     onChange={formik.handleChange}
    //                 />
    //                 <span onClick={togglePassword}>
    //                     {passwordShown ? "Hide" : "Show"}
    //                 </span>
    //             </div>

    //             <button className={LoginStyles.login_btn} type="submit" isLoading={formik.isSubmitting}>LOGIN</button>
    //             <div className={LoginStyles.sign_up}>Don't have an account? <Link to="/pages/landlord_signup" className={LoginStyles.sign_up_link}>Sign up!</Link></div>
    //             <Link className={LoginStyles.password_reset}>forget password?</Link>

    //         </form>
    //     </div>
    // )
}

export default LandlordLogin