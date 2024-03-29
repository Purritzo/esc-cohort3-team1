import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Formik, Form } from 'formik'; // Import Formik components

import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";

import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    VStack,
    Heading,
    useToast
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

import NavigationBar from "../components/NavigationBar.js";

const QuotationUpload = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const token = useAuthHeader();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  var ticketID;
  if (location.state != null){
    ticketID = location.state.ticketID;
  }
  console.log('ID', ticketID)
  const authenticated = useIsAuthenticated();

  const retrieveFile = () => {
    const config = {
        headers: {
            Authorization: `${token()}`
        },
        params: {
            id: ticketID,
            responseType: "blob"
        }
    }
    const encodedticketID = encodeURIComponent(ticketID);
    fetch(`http://localhost:5000/api/landlord/getQuotation/?id=${encodedticketID}`,{
    headers:{
      Authorization: `${token()}`
    }}
    ) // Replace with the actual backend URL serving the PDF
      .then((response) => response.blob())
      .then((data) => {
        console.log('data',data)
        const pdfBlobUrl = URL.createObjectURL(data);
        setPdfUrl(pdfBlobUrl);
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      })
    }
    // Ensure that user is authenticated for all renders
    const authenticate = () => {
        // Check if still autenticated based on react auth kit
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            navigate('/')
            return false
        } else {
            return true
        }
    }
    useEffect(() => {
        authenticate()
    })

    const navigateToViewTicketPage =  (ticketID) => {
      navigate('/pages/ViewTicketPage/', { state: { ticketID } } );
    }

    return (
    <>
      {NavigationBar()}
      <Flex align="center" justify="center" h="100vh" w="100%">
        <Helmet>
          {/* ... Your Helmet content ... */}
        </Helmet>
        <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
          <Formik
            initialValues={{ files: null }} // Set initial values
            onSubmit={async (values) => { // Handle form submission
              const formData = new FormData();
              formData.append("files", values.files); // Access files through form values
              try {
                const response = await axios.post(
                  `http://localhost:5000/api/landlord/uploadQuotation/`,
                  formData,
                  {
                    params: { 
                      'api-version': '3.0',
                      ticket_id: ticketID
                  },
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `${token()}`
                    },
                  }
                );
                console.log(response);
                navigateToViewTicketPage(ticketID);
                toast({
                    title: "Quotation Uploaded",
                    description: "Quotation has been attached to the ticket.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    })
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {({ handleSubmit, setFieldValue }) => ( // Use Formik's handleSubmit and setFieldValue
              <Form target="_blank" action={`http://localhost:5000/api/landlord/uploadQuotation/${ticketID}`} method="POST" encType="multipart/form-data">
                <VStack align="flex-start" alignItems="center">
                  <Heading marginTop="4">Quotation Upload</Heading>
                  <FormControl marginTop="6">
                    <Input
                      id="files"
                      name="files"
                      type="file"
                      variant="filled"
                      placeholder="Upload Quotation"
                      accept=".pdf"
                      p={1}
                      onChange={(event) => setFieldValue("files", event.currentTarget.files[0])} // Update form values using setFieldValue
                    />
                  </FormControl>
                  <FormControl marginTop="6" >
                    <Button
                      id="UploadButton"
                      type="submit"
                      backgroundColor="rgb(192, 17, 55)"
                      width="full"
                      textColor="white"
                      variant="unstyled"
                    >
                      Upload Quotation
                    </Button>
                  </FormControl>
                </VStack>
              </Form>
            )}
          </Formik>
          <Button
            id="GetButton"
            type="submit"
            backgroundColor="rgb(192, 17, 55)"
            width="full"
            textColor="white"
            variant="unstyled"
            onClick={retrieveFile}
            marginTop="6"
          >
            Get Quotation
          </Button>
          <Box>
            {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default QuotationUpload;