import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { serverFunctions } from '../../../utils/serverFunctions';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom, IDAtom } from './InspoData';

function AddInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [ID, setID] = useAtom(IDAtom);

  const addTextFromSelection = () => {
    let text = serverFunctions.copyInspiration();
    // resolve promise
    text.then(function (text) {
      setInspoText(text);
    });
  };

  const addInspiration = () => {
    if (inspoText !== '') {
      let newRecord = {
        id: ID,
        sourceDocumentName: 'test',
        content: inspoText,
      };
      setHistory([...history, newRecord]);
      setID(ID + 1);
      setInspoText('');
    }
  };

  const clearInspiration = () => {
    setInspoText('');
  };

  const readClipboardContent = async () => {
    // clipboard access is granted to the iframe wrapper
    // when using this fuction, chrome will first ask for clipboard visit permission

    // need to install clipboard-polyfill
    // let text = await clipboard.readText();
    navigator.clipboard
      .readText()
      .then((text) => {
        setInspoText(text);
      })
      .catch((error) => {
        console.error('Failed to read clipboard:', error);
        // Handle the error, e.g. display an error message to the user
      });
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
        <Button variant="outlined" onClick={addTextFromSelection}>
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
