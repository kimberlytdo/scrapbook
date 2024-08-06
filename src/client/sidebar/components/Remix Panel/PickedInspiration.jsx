import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Tooltip from '@mui/material/Tooltip';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Shuffle } from '@mui/icons-material';

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
        renderInput={(params) => {
          return <TextField {...params} label="Search inspiration" />;
        }}
      />
      {inspoContent && (
        <div>
      <Box>
        <Tooltip title="Copy to remix">
          <IconButton size="small">
            <ShuffleIcon
              fontSize="small"
              onClick={() =>
                setTagsInputList([
                  ...tagsInputList,
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
                  inspoContent
                );
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              {inspoContent}
            </Typography>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}

export default PickedInspiration;
