import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { serverFunctions } from '../../../utils/serverFunctions';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom } from './InspoData';
import { currentInspoTextAtom } from './InspoData';

function AddInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);

  const addTextFromSelection = () => {
    let text = serverFunctions.copyInspiration();
    // resolve promise
    text.then(function (text) {
      console.log(text);
      setInspoText(text);
    });
  };

  const addInspiration = () => {
    if (inspoText !== "") {
      setHistory([...history, inspoText]);
    }
  };

  const clearInspiration = () => {
    setInspoText('');
  };

  const readClipboardContent = () => {
    // somehow does not work anymore? perhaps due to browser update
    // need workaround
    let tempTextArea = document.createElement('textarea');
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    document.execCommand("paste", true)
    setInspoText(tempTextArea.value);
    document.body.removeChild(tempTextArea);
  };

  const handleContentChange = (e) => {
    setInspoText(e.target.value);
  };

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
        <Button variant="text" onClick={clearInspiration}>
          Clear
        </Button>
        <Button variant="outlined" onClick={readClipboardContent}>
          Paste from Clipboard
        </Button>
        <Button varient="outlined" onClick={addTextFromSelection}>
          Paste from Selection
        </Button>
        <Button variant="outlined">Auto-Add</Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addInspiration}
        >
          Add Inspiration
        </Button>
      </Stack>
    </div>
  );
}

export default AddInspo;
