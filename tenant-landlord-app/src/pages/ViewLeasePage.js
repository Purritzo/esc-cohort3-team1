import React, { useContext, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, useToast, Heading } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar.js';
import { SelectedTicketContext } from '../components/SelectedTicketContext.js';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ViewLeasePage() {
    const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);
    const ticketName = `${selectedTicket.id}`; 
    const [pdfUrl,setPdfUrl] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/landlord/getQuotation/?id=${selectedTicket.id}`,
        ) // Replace with the actual lease pdf, now still quotation
          .then((response) => response.blob())
          .then((data) => {
            console.log('data',data)
            const pdfBlobUrl = URL.createObjectURL(data);
            setPdfUrl(pdfBlobUrl);
          })
          .catch((error) => {
            console.error(error);
            // Handle error
          });
      }, []);

    return (
        <>
        {NavigationBar()}
        <Box p={10} bg="#EDF2F7" borderRadius="md" boxShadow="lg" mr = "10%" ml="10%">
            <Heading mb={5} textAlign="center">Lease for ticket: {ticketName}</Heading>
            <Box display="flex" flexDirection="column" justifyContent="center" minHeight="50vh">
                {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
            <Box display="flex" justifyContent="space-around" m={1} p={1}>
                <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline" onClick={() => navigate(-1)}>
                Back
                </Button>
            </Box>
            </Box>
        </Box>
        </>
    );
}

export default ViewLeasePage;