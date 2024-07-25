import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip'
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import { Autocomplete, TextField } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom } from '../../data/InspoData';
import { BookmarkedAtom, tagsInputAtom } from '../state';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function PickedInspiration() {
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [bookmarked, setBookmarked] = useAtom(BookmarkedAtom);
  const [remixInspoPageLength, setRemixInspoPageLength] = useState(0);
  const [remixInspoCurrentPage, setRemixInspoCurrentPage] = useState(1);
  const [tagsInputList, setTagsInputList] = useAtom(tagsInputAtom);
  const [inspoContent, setInspoContent] = useState("");


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
      <Autocomplete
        value={inspoContent}
        onChange={(event, newValue) => {
          setInspoContent(newValue);
        }}
        disablePortal
        id="combo-box"
        disabled={bookmarked.length === 0}
        options={
          bookmarked.length === 0 ? '' : bookmarked.map((item) => item.content)
        }
        // getOptionLabel={(option) => {
        //   const truncatedContent = option.slice(0, 20);
        //   return option.length > 20
        //     ? `${truncatedContent}...`
        //     : truncatedContent;
        // }}
        renderInput={(params) => {
          return <TextField {...params} label="Search inspiration" />;
        }}
      />
      <Box>
        <Tooltip title="Copy to remix">
          <IconButton size="small">
            <NoteAddIcon
              fontSize="small"
              onClick={() =>
                setTagsInputList([
                  ...tagsInputList,
                  // retrieveBookmarked(remixInspoCurrentPage),
                  inspoContent,
                ])
              }
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy to clipboard">
          <IconButton size="small">
            <ContentCopyIcon
              fontSize="small"
              onClick={() => {
                navigator.clipboard.writeText(
                  // retrieveBookmarked(remixInspoCurrentPage)
                  inspoContent
                );
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        fontFamily={'Roboto'}
        height={100}
        sx={{ overflowY: 'auto', padding: 2 }}
      >
        {inspoContent}
        {/* {retrieveBookmarked(remixInspoCurrentPage)} */}
      </Box>
      {/* <Pagination
        count={remixInspoPageLength}
        page={remixInspoCurrentPage}
        size={'small'}
        onChange={(e, page) => {
          setRemixInspoCurrentPage(page);
        }}
        siblingCount={0}
        boundaryCount={0}
      /> */}
    </div>
  );
}

export default PickedInspiration;
