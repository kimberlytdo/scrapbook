import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { serverFunctions } from '../../../utils/serverFunctions';

function AddInspo() {
  const [inspoText, setInspoText] = useState('');

  const addTextFromSelection = () => {
    let text = serverFunctions.copyInspiration()
    // resolve promise
    text.then(function(text) {
      console.log(text)
      setInspoText(text);
    })
  }

  const handleContentChange = (e) => {
    setInspoText(e.target.value)
  }

  return (
    <div>
      <TextField
        id="inspo-textarea"
        label="Add inspo to remix"
        placeholder="Placeholder"
        multiline
        variant="filled"
        rows={5}
        maxRows={10}
        value={inspoText}
        onChange={(e) => handleContentChange(e)}
      />
      <Stack spacing={1} direction={'column-reverse'}>
        <Button variant="text">Clear</Button>
        <Button variant="outlined">Paste from Clipboard</Button>
        <Button varient="outlined" onClick={addTextFromSelection}>Paste from Selection</Button>
        <Button variant="outlined">Auto-Add</Button>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Inspiration
        </Button>
      </Stack>
    </div>
  );
}

export default AddInspo;
