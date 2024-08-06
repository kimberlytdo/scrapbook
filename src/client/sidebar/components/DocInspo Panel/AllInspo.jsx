import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import BookmarkAdded from '@mui/icons-material/BookmarkAdded';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link'; // New icon import for URL
import { serverFunctions } from '../../../utils/serverFunctions';
import { useAtom } from 'jotai';
import { InspoHistoryAtom } from '../../data/InspoData';
import { outputAtom, historyAtom, docInfoAtom, numSuggestionsAtom, copyFirstSentenceAtom, pasteFirstSentenceAtom, tagsInputAtom, BookmarkedAtom } from '../state';

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
  const [currentFileName, setCurrentFileName] = useState('');
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (currentFileName === '') {
      cacheCurrentFileName();
    }
  }, [history]);

  const cacheCurrentFileName = () => {
    serverFunctions.getDocumentName().then((docName) => {
      setCurrentFileName(docName);
    });
  };

  const handleBookmark = (index) => {
    let newRecord = {
      ...history[index],
      isBookmarked: !history[index].isBookmarked,
    };
    setHistory((prev) => {
      const newArray = [...prev];
      newArray[index] = newRecord;
      return newArray;
    });
  };

  const handleDelete = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log("Copied text:", text);
  };

  const renderBookmark = (index) => {
    return history[index].isBookmarked ? <BookmarkAdded /> : <BookmarkBorderIcon />;
  };

  const handleRemix = (text) => {
    setTagsInputList((prev) => [...prev, text]); // Save text to tagsInputAtom
    console.log("Sent to remixer text:", text);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage);
  const pageCount = Math.ceil(history.length / itemsPerPage);

  const [inputValue, setInputValue] = useState('');
  const [tagsInputList, setTagsInputList] = useAtom(tagsInputAtom);

  return (
    <>
      {history.length === 0 ? (
        <Typography variant="h6">Please add content</Typography>
      ) : (
        <>
          {paginatedHistory.map((item, index) => (
            <Card key={startIndex + index} sx={{ maxWidth: 345, marginBottom: 2, padding: 4 }}>
              <CardContent>
                <Typography variant="body1">{item.sourceDocumentName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
              </CardContent>
              <IconButton aria-label="use inspiration" onClick={() => handleBookmark(startIndex + index)}>
                {renderBookmark(startIndex + index)}
              </IconButton>
              <IconButton aria-label="copy" onClick={() => handleCopy(item.content)}>
                <ContentCopyIcon />
              </IconButton>
              <IconButton aria-label="remix" onClick={() => handleRemix(item.content)}>
                <ShuffleIcon />
              </IconButton>
              {item.url && (
                <IconButton
                  aria-label="open link"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <LinkIcon />
                </IconButton>
              )}
              <IconButton aria-label="delete" onClick={() => handleDelete(startIndex + index)}>
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={0}
              boundaryCount={0}
            />
          </Box>
        </>
      )}
    </>
  );
}
