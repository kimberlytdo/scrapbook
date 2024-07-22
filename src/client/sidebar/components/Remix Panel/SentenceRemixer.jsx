import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { inputAtom, outputAtom, historyAtom, docInfoAtom, numSuggestionsAtom, copyFirstSentenceAtom, pasteFirstSentenceAtom, tagsInputAtom, BookmarkedAtom } from '../state';
import axios from 'axios';
import { Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { serverFunctions } from '../../../utils/serverFunctions';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

const promptMap = {
  paraphrase: (inputText, docInfo) =>
    `Please paraphrase the following text and use the following information to guide the paraphrasing:
    
    Title: ${docInfo.title}
    Audience: ${docInfo.audience}
    Tone: ${docInfo.tone}
    Style: ${docInfo.style}
    
    Text: ${inputText}`,
  summarize: (inputText, docInfo) =>
    `Please summarize the following text and use the following information to guide the summarization:
    
    Title: ${docInfo.title}
    Audience: ${docInfo.audience}
    Tone: ${docInfo.tone}
    Style: ${docInfo.style}
    
    Text: ${inputText}`,
  simplify: (inputText, docInfo) =>
    `Please simplify the following text and use the following information to guide the simplification:
    
    Title: ${docInfo.title}
    Audience: ${docInfo.audience}
    Tone: ${docInfo.tone}
    Style: ${docInfo.style}
    
   Text: ${inputText}`,
  combine: (inputText, docInfo) =>
    `Please combine the following text and use the following information to guide the combination:
    
    Title: ${docInfo.title}
    Audience: ${docInfo.audience}
    Tone: ${docInfo.tone}
    Style: ${docInfo.style}
    
    Text: ${inputText}`,
};

const fetchChatGPTResponse = async (inputText, mode, docInfo, numSuggestions) => {
  const prompt = promptMap[mode.toLowerCase()](inputText, docInfo);
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      n: numSuggestions,
      messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ',
    },
  });
  return response.data.choices.map(choice => choice.message.content.trim());
};

function SentenceRemixer() {
  const [alignment, setAlignment] = useState('Paraphrase');
  const [input, setInput] = useAtom(inputAtom);
  const [, setOutput] = useAtom(outputAtom);
  const [docInfo] = useAtom(docInfoAtom);
  const [copyFirstSentence] = useAtom(copyFirstSentenceAtom);
  const [pasteFirstSentence] =useAtom(pasteFirstSentenceAtom);
  const [numSuggestions] = useAtom(numSuggestionsAtom);
  const [, setHistory] = useAtom(historyAtom);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = async (e) => {
    // Note! Note that now the inspos are in a list stored in tagsInputList
    // Remember to upddate the function
    e.preventDefault();
    setLoading(true);
    try {
      // Ruishi: Work around now is to simply concat the text
      let concatenatedInput = tagsInputList.join(' ')
      const responses = await fetchChatGPTResponse(concatenatedInput, alignment, docInfo, numSuggestions);
      setOutput(responses.slice(0, numSuggestions));
      setHistory((prev) => [
        ...prev,
        {
          mode: alignment,
          date: new Date(),
          input: tagsInputList,
          responses: responses.slice(0, numSuggestions),
        },
      ]);
      if (copyFirstSentence && responses.length > 0) {
        navigator.clipboard.writeText(responses[0]);
      }
      // if (pasteFirstSentence && responses.length > 0) {
      //   // Call Google Apps Script function to insert first sentence at cursor position
      //   console.log("test")
      //   serverFunctions.insertGeneratedText(responses[0]);
      // }
    } catch (error) {
      console.error('Error fetching response from ChatGPT', error);
    } finally {
      setLoading(false);
    }
  };

  const [bookmarked, setBookmarked] = useAtom(BookmarkedAtom)

  const concatBookmarkedContent = (bookmarked) => bookmarked.map(tag => tag.content)

  useEffect(() => {
    setTagsInputList(concatBookmarkedContent(bookmarked))
  }, [bookmarked]);

  const [tagsInputList, setTagsInputList] = useAtom(tagsInputAtom);

  const addInspoTag = (tag) => { 
    setTagsInputList(tag)
  };

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        size="small"
        orientation="horizontal"
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="Paraphrase">Para</ToggleButton>
        <ToggleButton value="Summarize">Sum</ToggleButton>
        <ToggleButton value="Simplify">Simpl</ToggleButton>
        <ToggleButton value="Combine">Comb</ToggleButton>
      </ToggleButtonGroup>

      {/* <TextField
        id="filled-textarea"
        label="Add inspo to remix"
        placeholder="Placeholder"
        multiline
        variant="filled"
        rows={5}
        maxRows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> */}


      <TagsInput value={tagsInputList} onChange={(tag) => {addInspoTag(tag)}} />

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>
    </div>
  );
}

export default SentenceRemixer;
