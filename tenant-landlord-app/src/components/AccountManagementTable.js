import { Accordion, 
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Button,
    FormControl,
    useDisclosure,
    IconButton,
    Box,
    TableContainer,
    } from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons'
import {useNavigate} from 'react-router-dom';
import Popup from 'reactjs-popup';

import React, { useEffect } from 'react';


// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Generate the table for managing accounts. This table can be generated by landlords and admin
 * @param {*} APIDeleteAllUsers These users represent the target users used in the table
 * @param {*} user This user represent the target user used in the table
 * @param {*} getUserAccounts These users represent the target users used in the table
 * @returns 
 */
export default function AccountManagementTable(APIDeleteAllUsers, user, getUserAccounts, role){
  const navigate = useNavigate();
  console.log("role", role);


  var ticketTypeIsVisible = '';
  var currentLeaseIsVisible = '';
  var tableIsVisible = '';
  var roleIsVisible = '';

  //TEMPORARY SOLUTION
  //if the caller is a staff, then set the landlord details table invisible
  //this "role" argument will only be included in the landlord details table
  if(role === "staff"){
    tableIsVisible = "none"
  }

  //set certain headers to invisible depending on the users displayed in the table
  if (user === "Tenant"){
    ticketTypeIsVisible = "none";
    roleIsVisible = "none";
  } else if (user === "Landlord"){
    currentLeaseIsVisible = "none";
  }

  const navigateToUserCreationPage = () => {
    if (user === "Tenant"){
      navigate('/pages/TenantCreationPage');
    }
    else if (user === "Landlord"){
      navigate('/pages/LandlordCreationPage');
    }
    
  }


  return (
      <>
      <Box display={tableIsVisible}>
        <Box position="relative" float="right" marginTop="2em" right="7em" >
          <Button
            onClick={navigateToUserCreationPage}
            colorScheme='teal'
            padding={2}
            textColor="white"
          >
          Create New {user}
          </Button>
        </Box>
        <Box  fontSize="30px" marginLeft="2.6em" marginTop="1.5em" position="relative" display="inline-block">
          {user} Details
        </Box> 
        <TableContainer display="inline-block" margin="5em" marginTop="0em" border="1px" borderColor="gray.300" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)" background="white" position="relative" width="90%">
          <Table variant='simple'>
          <Thead margin={0} backgroundColor="blue.400" width="100%">
              <Tr>
                  <Th width='35em' textAlign='left' paddingRight={0} paddingLeft={4} textColor="white"> Email </Th>
                  <Th width='35em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white" display={ticketTypeIsVisible}> Ticket Type </Th>
                  <Th width='35em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white" display={roleIsVisible}> Role </Th>
                  <Th width='70em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white" display={currentLeaseIsVisible}>Current Lease</Th>
                  <Th width='35em' textAlign='left' paddingRight={0} paddingLeft={0} textColor="white">Building ID</Th>
                  <Th align='right' paddingRight={0} paddingLeft={0} >
                    <Popup trigger={<IconButton size='sm' icon={<DeleteIcon />} />} >
                      <FormControl>
                        <Button 
                          onClick={() => APIDeleteAllUsers()}
                          colorScheme='red'
                          >
                          confirm?
                        </Button>
                      </FormControl>
                    </Popup>
                  </Th>
              </Tr>
          </Thead>
          </Table>
          <Accordion allowToggle >
            {getUserAccounts}
          </Accordion>
        </TableContainer>
      </Box>

      </>
  )
}