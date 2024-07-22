import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { outputAtom, historyAtom, docInfoAtom, numSuggestionsAtom, copyFirstSentenceAtom, pasteFirstSentenceAtom, tagsInputAtom, BookmarkedAtom } from '../state';
import axios from 'axios';
import { Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Height } from '@mui/icons-material';

const promptMap = {
  paraphrase: (inputText, docInfo) =>
    `Please paraphrase the following text and use the following information to guide the paraphrasing. Only return a paraphrased sentence using the information below. Do not surround the output response in quotation marks.
    
    Here is the document's intended title, which you can use to guide the subject of the sentence: ${docInfo.title}
    Here is the document's intended audience, which you can use to guide the writing style of the sentence: ${docInfo.audience}
    Here is the document's intended tone, which you can use to guide the tone of the sentence: ${docInfo.tone}
    Here is the document's intended style, which you can use to guide the writing style of the sentence: ${docInfo.style}
    
    Write a sentence that comprehensively paraphrases the main ideas included in the following: ${inputText}`,
  summarize: (inputText, docInfo) =>
    `Please summarize the following text and use the following information to guide the summarization. Only return a summarized sentence using the information below. Do not surround the output response in quotation marks.
    
    Here is the document's intended title, which you can use to guide the subject of the sentence: ${docInfo.title}
    Here is the document's intended audience, which you can use to guide the writing style of the sentence: ${docInfo.audience}
    Here is the document's intended tone, which you can use to guide the tone of the sentence: ${docInfo.tone}
    Here is the document's intended style, which you can use to guide the writing style of the sentence: ${docInfo.style}
    
    Summarize the information below into a sentence that integrates the ideas included in the following: ${inputText}`
    ,
  simplify: (inputText, docInfo) =>
    `Please simplify the following text and use the following information to guide the simplification. Only return a simplified sentence using the information below. Do not surround the output response in quotation marks.
    
    Here is the document's intended title, which you can use to guide the subject of the sentence: ${docInfo.title}
    Here is the document's intended audience, which you can use to guide the writing style of the sentence: ${docInfo.audience}
    Here is the document's intended tone, which you can use to guide the tone of the sentence: ${docInfo.tone}
    Here is the document's intended style, which you can use to guide the writing style of the sentence: ${docInfo.style}
    
    Simplify the following information to create a concise sentence: ${inputText}`
    ,
  combine: (inputText, docInfo) =>
    `Please combine the following text and use the following information to guide the combination. Only return a combined sentence using the information below. Do not surround the output response in quotation marks.
    
    Here is the document's intended title, which you can use to guide the subject of the sentence: ${docInfo.title}
    Here is the document's intended audience, which you can use to guide the writing style of the sentence: ${docInfo.audience}
    Here is the document's intended tone, which you can use to guide the tone of the sentence: ${docInfo.tone}
    Here is the document's intended style, which you can use to guide the writing style of the sentence: ${docInfo.style}
    
    Combine the information below into a sentence that integrates the ideas included in the following: ${inputText}`,
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
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-proj-',
      },
    }
  );
  return response.data.choices.map((choice) => choice.message.content.trim());
};

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-inputRoot': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  '& .MuiChip-root': {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    margin: '2px',
  },
  '& .MuiInputBase-root': {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

const MultilineChip = styled(Chip)({
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  maxWidth: 'auto',
  margin: '4px',
  height: 'auto',
  padding: '3px',
  '& .MuiChip-label': {
    display: 'block',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    padding: '5px',
  },
});

function SentenceRemixer() {
  const [alignment, setAlignment] = useState('Paraphrase');
  const [, setOutput] = useAtom(outputAtom);
  const [docInfo] = useAtom(docInfoAtom);
  const [copyFirstSentence] = useAtom(copyFirstSentenceAtom);
  const [pasteFirstSentence] = useAtom(pasteFirstSentenceAtom);
  const [numSuggestions] = useAtom(numSuggestionsAtom);
  const [, setHistory] = useAtom(historyAtom);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [tagsInputList, setTagsInputList] = useAtom(tagsInputAtom);
  const [bookmarked, setBookmarked] = useAtom(BookmarkedAtom);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let concatenatedInput = tagsInputList.join(' ');
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
    } catch (error) {
      console.error('Error fetching response from ChatGPT', error);
    } finally {
      setLoading(false);
    }
  };

  const concatBookmarkedContent = (bookmarked) => bookmarked.map((tag) => tag.content);

  useEffect(() => {
    setTagsInputList(concatBookmarkedContent(bookmarked));
  }, [bookmarked]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim() !== '') {
        setTagsInputList([...tagsInputList, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setTagsInputList((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  useEffect(() => {
    const savedTags = localStorage.getItem('tagsInputList');
    if (savedTags) {
      setTagsInputList(JSON.parse(savedTags));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tagsInputList', JSON.stringify(tagsInputList));
  }, [tagsInputList]);
  

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

      <StyledAutocomplete
        multiple
        freeSolo
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={tagsInputList}
        onChange={(event, newValue) => setTagsInputList(newValue)}
        options={[]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <MultilineChip
              key={option}
              label={option}
              {...getTagProps({ index })}
              onDelete={handleDelete(option)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Enter text"
            multiline
            rows={3}
          />
        )}
      />

      <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth="true">
        {loading ? 'Loading...' : 'Remix It!'}
      </Button>
    </div>
  );
}

export default SentenceRemixer;
