import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { serverFunctions } from '../../../utils/serverFunctions';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom } from './InspoData';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function AllInspo() {
  const [currentfileName, setCurrentFileName] = useState('');
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [pageLength, setPageLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentfileName === '') {
      cacheCurrentFileName();
    }
    getHistoryLength();
  }, [history]);

  const cacheCurrentFileName = () => {
    serverFunctions.getDocumentName().then((docName) => {
      setCurrentFileName(docName);
    });
  };

  const retrieveHistory = (page) => {
    if (history.length <= 0) {
      return 'Please add content';
    } else {
      return history[page - 1].content;
    }
  };

  const getHistoryLength = () => {
    setPageLength(history.length);
  };

  const handleDelete = (text) => {
    setHistory((prev) => prev.filter((item) => item !== text));
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          subheader={
            <Pagination
              count={pageLength}
              page={currentPage}
              size={'small'}
              onChange={(e, page) => {
                setCurrentPage(page);
              }}
              siblingCount={0}
              boundaryCount={0}
            />
          }
        />
        <CardContent>
          <Typography variant="body1">{currentfileName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {retrieveHistory(currentPage)}
          </Typography>
        </CardContent>

        <CardActions>
          <IconButton aria-label="use inspiration">
            <BookmarkBorderIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon
              onClick={() => handleDelete(history[currentPage - 1])}
            />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
