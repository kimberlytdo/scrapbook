import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { serverFunctions } from '../../../utils/serverFunctions';
import { useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom, IDAtom } from '../../data/InspoData';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { WebHistoryAtom } from '../../data/InspoData';
import axios from 'axios';

function WebAddInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [urlText, setUrlText] = useAtom(WebHistoryAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  const [ID, setID] = useAtom(IDAtom);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState('document');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState(''); // State for the "Webpage Inspiration URL" text field

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
        sourceDocumentName: title,
        content: inspoText,
        isBookmarked: false,
      };
      setHistory([...history, newRecord]);
      setID(ID + 1);
      setInspoText('');
      setTitle('');
    }
  };

  const addWebInspiration = () => {
    if (inspoText !== '') {
      let newRecord = {
        id: ID,
        sourceDocumentName: title,
        content: inspoText,
        isBookmarked: false,
        url: url, // Add the URL to the record
      };
      setHistory([...history, newRecord]);
      setUrlText([...urlText, newRecord]);
      console.log(urlText);
      setID(ID + 1);
      setInspoText('');
      setTitle('');
      setUrl(''); // Clear the URL field after adding the inspiration
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const fetchChatGPTResponse = async (prompt) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error fetching response from ChatGPT:', error);
      return '';
    }
  };

  const fetchWebpageContent = async (url) => {
    try {
      const response = await fetch(`https://r.jina.ai/${url}`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${process.env.JINA_AI_API_KEY}`,
          "X-With-Links-Summary": "true",
          "X-Return-Format": "text",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      return error;
    }
  };  

  const autoAddText = async () => {
    console.log(serverFunctions);
  
    setLoading(true);
    try {
      let documentText;
      if (selectedSource === 'webpage') {
        documentText = await fetchWebpageContent(url);
      } else {
        documentText = await serverFunctions.getDocumentText();
      }
      const prompt = `Return an inspirational sentence that offers an original insight or ideas following text:\n\n${documentText}. The sentence should be in verbatim. Do not alter anything from the original source document. Provide an exact quote from the provided text. Do not surround the quote in quotation marks. If there is no text, say "Please try again".`;
      const response = await fetchChatGPTResponse(prompt);
      setInspoText(response);
    } catch (error) {
      console.error('Error auto-adding text:', error);
      setInspoText("ERROR");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  return (
    <div>
     <FormControl component="fieldset">
        <FormLabel component="legend">Inspiration Source Type</FormLabel>
        <RadioGroup
          row
          aria-label="source"
          name="source"
          value={selectedSource}
          onChange={handleSourceChange}
        >
          <FormControlLabel value="document" control={<Radio />} label="Document" />
          <FormControlLabel value="webpage" control={<Radio />} label="Webpage" />
        </RadioGroup>
      </FormControl>
      <TextField
        id="inspo-title"
        label="Inspiration Title (Optional)"
        variant="filled"
        value={title}
        onChange={handleTitleChange}
      />
      {selectedSource === 'webpage' && (
        <TextField
          id="inspo-url"
          label="Webpage Inspiration URL"
          variant="filled"
          value={url}
          onChange={handleUrlChange} // Handle URL change
          fullWidth
        />
      )}
      <TextField
        id="inspo-textarea"
        label="Add New Inspiration"
        placeholder="Type some inspiration to save for later"
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
        <Button variant="outlined" onClick={autoAddText}>
          Paste Inspiration for Me
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={selectedSource === 'webpage' ? addWebInspiration : addInspiration}
        >
          Add Inspiration
        </Button>
      </Stack>
    </div>
  );
}


export default WebAddInspo;