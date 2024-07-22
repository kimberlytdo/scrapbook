import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddInspo from './WebAddInspo';
import TextField from '@mui/material/TextField';
import AllInspo from './WebAllInspo';

function WebInspirations() {
  const [expanded, setExpanded] = useState([true, true, true]);

  const handleChange = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <div>
      <Accordion expanded={expanded[0]} onChange={() => handleChange(0)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content1"
          id="panel-header1"
        >
          <Typography>Add Inspiration from a Webpage</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddInspo />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded[2]} onChange={() => handleChange(2)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content3"
          id="panel-header3"
        >
          <Typography>All Web Inspiration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AllInspo />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default WebInspirations;
