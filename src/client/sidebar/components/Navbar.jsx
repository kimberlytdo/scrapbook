import React, { useState } from 'react';
import { Theme } from './theme';
import { Tabs, Tab, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Customize from './Customize Panel/Customize';
import Remix from './Remix Panel/Remix';
import History from './History Panel/History';
import Inspirations from './DocInspo Panel/Inspirations';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function Navbar() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ThemeProvider theme={Theme}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          scrolButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          <Tab label="Remix" />
          <Tab label="Inspo" />
          <Tab label="History" />
          <Tab label="Customize" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Remix />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Inspirations />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <History />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Customize />
        </TabPanel>
      </ThemeProvider>
    </div>
  );
}

export default Navbar;
