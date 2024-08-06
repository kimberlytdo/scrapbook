import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { serverFunctions } from '../../../utils/serverFunctions';
import { useAtom } from 'jotai';
import { InspoHistoryAtom } from '../../data/InspoData';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkAdded from '@mui/icons-material/BookmarkAdded';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function WebTemplate() {
  const [currentFileName, setCurrentFileName] = useState('');
  const [history, setHistory] = useAtom(InspoHistoryAtom);

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

  const renderBookmark = (index) => {
    return history[index].isBookmarked ? <BookmarkAdded /> : <BookmarkBorderIcon />;
  };

  const handleSelectChange = (index, event) => {
    console.log(`Selected option for item ${index}:`, event.target.value);
    // Handle the selection change logic here
  };

  return (
    <>
      {history.length === 0 ? (
        <Typography variant="h6">Please add content</Typography>
      ) : (
        history.map((item, index) => (
          <Card key={index} sx={{ maxWidth: 345, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="body1">{item.sourceDocumentName}</Typography>
              <FormControl variant="filled" fullWidth sx={{ mt: 2 }}>
                <InputLabel id={`select-label-${index}`}>Select Option</InputLabel>
                <Select
                  labelId={`select-label-${index}`}
                  id={`select-${index}`}
                  value=""
                  onChange={(event) => handleSelectChange(index, event)}
                >
                  <MenuItem value={1}>Option 1</MenuItem>
                  <MenuItem value={2}>Option 2</MenuItem>
                  <MenuItem value={3}>Option 3</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <IconButton aria-label="use inspiration" onClick={() => handleBookmark(index)}>
              {renderBookmark(index)}
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Card>
        ))
      )}
    </>
  );
}
