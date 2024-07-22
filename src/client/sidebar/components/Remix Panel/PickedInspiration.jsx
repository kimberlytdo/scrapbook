import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom } from '../../data/InspoData';
import { BookmarkedAtom } from '../state';

function PickedInspiration() {
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [bookmarked, setBookmarked] = useAtom(BookmarkedAtom);
  const [remixInspoPageLength, setRemixInspoPageLength] = useState(0);
  const [remixInspoCurrentPage, setRemixInspoCurrentPage] = useState(1);

  useEffect(() => {
    getBookmarkedList();
    // setRemixInspoPageLength(bookmarked.length);
  }, [history]);

  const getBookmarkedList = () => {
    let bookmarkedInspo = history
      .map((item) => {
        if (item.isBookmarked) {
          return item;
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
    if (bookmarkedInspo.length > 0) {
      setBookmarked(bookmarkedInspo);
      setRemixInspoPageLength(bookmarkedInspo.length);
    }  
  };

  const retrieveBookmarked = (page) => {
    if (bookmarked.length <= 0) {
      return 'Please add content';
    } else {
      return bookmarked[page - 1].content;
    }
  };

  return (
    <div>
      {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
        </FormControl> */}
      <Box
        fontFamily={'Roboto'}
        height={100}
        sx={{ overflowY: 'auto', padding: 2 }}
      >
        {retrieveBookmarked(remixInspoCurrentPage)}
      </Box>
      <Pagination
        count={remixInspoPageLength}
        page={remixInspoCurrentPage}
        size={'small'}
        onChange={(e, page) => {
          setRemixInspoCurrentPage(page);
        }}
        siblingCount={0}
        boundaryCount={0}
      />
    </div>
  );
}

export default PickedInspiration;
