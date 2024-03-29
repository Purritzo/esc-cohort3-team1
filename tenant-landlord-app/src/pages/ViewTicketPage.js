import React, { useState, useEffect } from 'react';
import { Box, Heading, Textarea, Input } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import NavigationBar from '../components/NavigationBar.js';
import CheckTicket from '../components/CheckTicket.js';

export default function ViewTicketPage() {
    const navigate = useNavigate();
    const token = useAuthHeader();
    const userDetails = useAuthUser();
    const [status, setstatus] = useState('');
    const [ticket, setTicket] = useState('');
    const location = useLocation();
    var ticketID;
    if (location.state != null){
        ticketID = location.state.ticketID;
    }
    console.log('ID', ticketID)
    console.log("userdetails", userDetails());
    const authenticated = useIsAuthenticated();

    const convertStatus = (status) => {
        if (status === 'tenant_ticket_created'){
            return 'Created'
        } else if (status === 'landlord_ticket_rejected'){
            return 'Rejected By Landlord'
        } else if (status === 'landlord_ticket_approved'){
            return 'Approved By Landlord'
        } else if (status === 'landlord_quotation_sent'){
            return 'Quotation Sent By Landlord'
        } else if (status === 'ticket_quotation_approved'){
            return 'Quotation Approved By Tenant'
        } else if (status === 'ticket_quotation_rejected'){
            return 'Quotation Rejected By Tenant'
        } else if (status === 'landlord_started_work'){
            return 'Work Started By Landlord'
        } else if (status === 'landlord_completed_work'){
            return 'Work Completed By Landlord'
        } else if (status === 'ticket_work_rejected') {
            return 'Work Rejected by Tenant'
        } else if (status === 'landlord_ticket_closed' || status === 'tenant_feedback_given'){
            return "Closed"
        }
    }

    const GetServiceTickets = (userDetails) => {
        if (userDetails() === undefined){
            return;
        }
        const type = userDetails().type;
        const tickets = [];
        let response;

        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            console.log('type',type)
            console.log(ticketID)
            try{
                const config = {
                    headers: {
                    Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email,
                        id: ticketID
                    }
                }
                if (type === 'landlord'){
                    response = await axios.get(
                    `http://localhost:5000/api/landlord/getTicketById/`,
                        // console.log(`http://localhost:5000/api/landlord/getTicketById/${selectedTicket}`),
                        config
                    )
                } else if (type === 'tenant'){ 
                    response = await axios.get(
                    `http://localhost:5000/api/tenant/getTicketById/`,
                        config
                    )
                } else if (type === 'admin'){
                    response = await axios.get(
                        `http://localhost:5000/api/admin/getTicketById/`,
                        config
                    )
                }
                console.log("got response:")
                console.log(response);
                return response.data.data;
            } catch (err){
                if (err && err instanceof AxiosError) {
                console.log("Error: ", err);
                }
                else if (err && err instanceof Error){
                console.log("Error: ", err);
                }
            }
        }

  
    // Initialise promise
    const ticket = APIGetTickets(type)
    // Wait for promise to be fulfilled (fetching tickets from database)
    ticket.then(function(result){
        console.log('result',result)
        // Naive data validation
        // console.log('result',result)
        // console.log(result !== undefined)
        if (result !== undefined){
            tickets.push(result);
        }   
        console.log('tickets',tickets)
        // console.log('tickets[0]',tickets[0])
        // console.log('tickets[0].request_description',tickets[0].request_description)
        var tenantComment = tickets[0].request_description;
        var category = tickets[0].ticket_type;
        setstatus(convertStatus(tickets[0].status))
        var timesubmitted = tickets[0].submitted_date_time;
        var floor = tickets[0].floor;
        var unit_number = tickets[0].unit_number;
        setTicket(tickets[0])
        // console.log('tenantComment', tenantComment);
        // console .log('category', category);
        // console.log('status', status);
        // console.log('timesubmitted', timesubmitted);
        formik.setValues({
          floor: floor,
          unit_number: unit_number,
          category: category,
          tenantComment: tenantComment,
          status: status,
          timesubmitted: timesubmitted,
        });
        // console.log('formik', formik.values);
    })
}

    const formik = useFormik({
        initialValues: {
            floor: '',
            unit_number: '',
            category: '',
            tenantComment: '',
            status: '',
            timesubmitted: '',
        },
        onSubmit: {},
    });

  
    useEffect(() => {
        if (authenticate()){
            GetServiceTickets(userDetails);
        }
    }, [status, navigate]);


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


    return (
    <>
    {NavigationBar()}

    <Box
      className='main container'
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="50vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="5vh"
    >
      {/* Title */}
      <Heading as="h4" size="2xl" marginBottom="1em">
        Your Service Ticket
      </Heading>

      {/* Comment Boxes */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="2em">
        {/* Comment Box 1 */}
        <Box flex="1" marginRight="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Floor
          </Heading>
          <Textarea 
            readOnly
            name="floor"
            marginBottom="2em"
            value={formik.values.floor}
            onChange={formik.handleChange}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Category Of Request
          </Heading>
          <Textarea 
            readOnly
            name="category"
            placeholder="Enter category"
            value={formik.values.category}
            onChange={formik.handleChange}
            marginBottom="1em"
          />
          <Heading as="h5" size="lg"  marginBottom="1em">
            Status
          </Heading>
          <Textarea 
            readOnly
            name="category"
            placeholder="Enter category"
            value={formik.values.status}
            onChange={formik.handleChange}
            marginBottom="1em"
          />
        </Box>

        {/* Comment Box 2 */}
        <Box flex="1" marginLeft="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Unit Number
          </Heading>
          <Textarea 
            readOnly
            name="unit_number"
            marginBottom="2em"
            value={formik.values.unit_number}
            onChange={formik.handleChange}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Description
          </Heading>
          <Textarea 
            readOnly
            name="tenantComment"
            placeholder="Enter your comment"
            value={formik.values.tenantComment}
            onChange={formik.handleChange}
            marginBottom="1em"
            rows={8}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Time Submitted
          </Heading>
          <Input
            name="Submitted time"
            value={formik.values.timesubmitted}
            isReadOnly
            marginBottom="2em"
          />
        </Box>
      </Box>

      {/* Submit Ticket Button */}

    </Box>
    <Box className='bottom container' justifyContent="center" display="flex">
    {CheckTicket(ticket, userDetails)}
    </Box>
    </>
  );
}

