import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { serverFunctions } from '../../../utils/serverFunctions';
import { useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom, IDAtom } from '../../data/InspoData';
import Link from '@mui/icons-material/Link';


import axios from 'axios';

function WebAddInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [ID, setID] = useAtom(IDAtom);
  const [loading, setLoading] = useState(false);

  const addTextFromSelection = () => {
    let text = serverFunctions.copyInspiration();
    text.then((text) => {
      setInspoText(text);
    }).catch((error) => {
      console.error('Error copying inspiration:', error);
    });
  };

  const addInspiration = () => {
    if (inspoText !== '') {
      let newRecord = {
        id: ID,
        sourceDocumentName: 'test',
        content: inspoText,
        isBookmarked: false,
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
    try {
      const text = await navigator.clipboard.readText();
      setInspoText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleContentChange = (e) => {
    setInspoText(e.target.value);
  };

  const fetchChatGPTResponse = async () => {
    try {
      const documentText = await serverFunctions.getDocumentText();
      const prompt = `Extract one inspirational sentence from the following text and do not surround it the sentence with quotation marks:\n\n${documentText}`;
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-proj-COxppCT609y5gCuzv7dMT3BlbkFJOQ4TGj8ROYGs3Ct2SRUh',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error fetching response from ChatGPT:', error);
      return '';
    }
  };

  const autoAddText = async () => {
    console.log(serverFunctions);

    setLoading(true);
    try {
      const documentText = await serverFunctions.getDocumentText();
      const prompt = `Extract one inspirational sentence from the following text and do not surround it the sentence with quotation marks:\n\n${documentText}`;
      const response = await fetchChatGPTResponse();
      setInspoText(response);
    } catch (error) {
      console.error('Error auto-adding text:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* <Link sx={{ color: 'action.active', mr: 4, my: 7 }} /> */}
        <TextField id="input-with-sx" label="Link to Web Inspiration" variant="filled" />
      </Box>
      <TextField
        id="inspo-textarea"
        label="Add New Inspiration (Optional)"
        placeholder="Type some web inspiration to save for later"
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
        {/* <Button variant="outlined" onClick={addTextFromSelection}>
          Paste from Selection
        </Button> */}
        <Button variant="outlined" onClick={autoAddText}>
          Paste Inspiration for Me
        </Button>
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

export default WebAddInspo;
