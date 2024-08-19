import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  outputAtom,
  historyAtom,
  docInfoAtom,
  numSuggestionsAtom,
  copyFirstSentenceAtom,
  pasteFirstSentenceAtom,
  tagsInputAtom,
  BookmarkedAtom,
  sentenceNumAtom,
  contextRemixAtom,
} from '../state';
import axios from 'axios';
import { Button } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { serverFunctions } from '../../../utils/serverFunctions';

// const [contextRemix] = useAtom(contextRemixAtom);

const promptMap = {
  paraphrase: (inputText, docInfo, sentenceNum) =>
    `Please combine and then paraphrase the following text using the provided information. Adjust the response based on the available details. If a title is provided, use it to guide the subject: ${docInfo.title || 'Use the content provided as the subject'}. If an audience is specified, tailor the writing style accordingly: ${docInfo.audience || 'Write for a general audience'}. If a tone is specified, adopt it: ${docInfo.tone || 'Adopt a neutral tone'}. If a style is specified, follow it: ${docInfo.style || 'Use a standard writing style'}.  If a prompt is provided, guide the intention of the sentence accordingly: ${docInfo.prompt || 'No specific intention provided'}. Generate an output that is exactly ${sentenceNum} sentences long, comprehensively paraphrasing the main ideas in the following text: ${inputText}. ${contextRemixAtom && getSelection()? `Make sure the output text integrates smoothly with the following context: ${getSelection()}.` : ''} Generate an output that is exactly ${sentenceNum} sentences long, comprehensively paraphrasing the main ideas in the following text: ${inputText}. Note that an output of 0 sentences would refer to a fragment or phrase, not a complete sentence. Do not surround the output response in quotation marks. Only return the suggested paraphrase; do not respond with a greeting or any other additional information.`,
  // summarize: (inputText, docInfo) =>
  //   `Please summarize the following text and use the following information to guide the summarization. Only return a summarized sentence using the information below. Do not surround the output response in quotation marks.

  //   Here is the document's intended title, which you can use to guide the subject of the sentence: ${docInfo.title}
  //   Here is the document's intended audience, which you can use to guide the writing style of the sentence: ${docInfo.audience}
  //   Here is the document's intended tone, which you can use to guide the tone of the sentence: ${docInfo.tone}
  //   Here is the document's intended style, which you can use to guide the writing style of the sentence: ${docInfo.style}

  //   Summarize the information below into a sentence that integrates the ideas included in the following: ${inputText}`
  //   ,
  simplify: (inputText, docInfo, sentenceNum) =>
    `Please simplify the following text using the provided information. Before simpligying the text, you may need to first combine the information into a logical statement. Adjust the response based on the available details. If a title is provided, use it to guide the subject: ${docInfo.title || 'Use the content provided as the subject'}. If an audience is specified, tailor the writing style accordingly: ${docInfo.audience || 'Write for a general audience'}. If a tone is specified, adopt it: ${docInfo.tone || 'Adopt a neutral tone'}. If a style is specified, follow it: ${docInfo.style || 'Use a standard writing style'}. If a prompt is provided, guide the intention of the sentence accordingly: ${docInfo.prompt || 'No specific intention provided'}. Generate an output that is exactly ${sentenceNum} sentences long and simplifies the following information to concisely convey the main ideas: ${inputText}. ${contextRemixAtom && getSelection() ? `Make sure the output text integrates smoothly with the following context: ${getSelection()}.` : ''} Generate an output that is exactly ${sentenceNum} sentences long, comprehensively paraphrasing the main ideas in the following text: ${inputText}. Note that an output of 0 sentences would refer to a fragment or phrase, not a complete sentence. Do not surround the output response in quotation marks. Only return the suggested paraphrase; do not respond with a greeting or any other additional information.`,
  combine: (inputText, docInfo, sentenceNum) =>
    `Please combine the following text using the provided information. Adjust the response based on the available details. If a title is provided, use it to guide the subject: ${docInfo.title || 'Use the content provided as the subject'}. If an audience is specified, tailor the writing style accordingly: ${docInfo.audience || 'Write for a general audience'}. If a tone is specified, adopt it: ${docInfo.tone || 'Adopt a neutral tone'}. If a style is specified, follow it: ${docInfo.style || 'Use a standard writing style'}. If a prompt is provided, guide the intention of the sentence accordingly: ${docInfo.prompt || 'No specific intention provided'}. Generate an output that is exactly ${sentenceNum}. ${contextRemixAtom && getSelection() ? `Make sure the output text integrates smoothly with the following context: ${getSelection()}.` : ''} Generate an output that is exactly ${sentenceNum} sentences long, comprehensively paraphrasing the main ideas in the following text: ${inputText}. Note that an output of 0 sentences would refer to a fragment or phrase, not a complete sentence. Do not surround the output response in quotation marks. Only return the suggested paraphrase; do not respond with a greeting or any other additional information.`,
};

const fetchChatGPTResponse = async (
  inputText,
  mode,
  docInfo,
  numSuggestions,
  sentenceNum
) => {
  const prompt = promptMap[mode.toLowerCase()](inputText, docInfo, sentenceNum);
  const response = await axios.post(
    process.env.REACT_APP_OPENAI_URL_BASE,
    {
      model: process.env.REACT_APP_OPENAI_MODEL,
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
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
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

const logTestMessage = async (inputText, outputResponse) => {
  try {
    // await serverFunctions.testLogging();
    const docName = await serverFunctions.getDocumentName();
    const logMessage = {
      docName: docName,
      input: inputText,
      output: outputResponse
    };
    const logMessageString = JSON.stringify(logMessage, null, 2); 
    await serverFunctions.logToCloud(logMessageString);
    console.log('Log sent to cloud:', logMessageString);
  } catch (error) {
    console.error('Error calling test log function:', error);
  }
};



function SentenceRemixer() {
  const [alignment, setAlignment] = useState('Paraphrase');
  const [, setOutput] = useAtom(outputAtom);
  const [docInfo] = useAtom(docInfoAtom);
  const [copyFirstSentence] = useAtom(copyFirstSentenceAtom);
  const [contextRemix] = useAtom(contextRemixAtom);
  const [sentenceNum] = useAtom(sentenceNumAtom);
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

  async function getSelection() {
    if (contextRemix) {
      try {
        let text = await serverFunctions.copyInspiration();
        return text;
      } catch (error) {
        console.error('Error copying current selection:', error);
        return ""
      }
    }
    else {
      return ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let currentSelection = await getSelection();
    try {
      let concatenatedInput = tagsInputList.join(' ');
      concatenatedInput += " " + currentSelection;
      const responses = await fetchChatGPTResponse(
        concatenatedInput,
        alignment,
        docInfo,
        numSuggestions,
        sentenceNum
      );
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
        logTestMessage(concatenatedInput, responses.join(' | '));
      }
      logTestMessage(concatenatedInput, responses.join(' | '));
    } catch (error) {
      console.error('Error fetching response from ChatGPT', error);
    } finally {
      setLoading(false);
    }
  };

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

  // useEffect(() => {
  //   const savedTags = localStorage.getItem('tagsInputList');
  //   if (savedTags) {
  //     setTagsInputList(JSON.parse(savedTags));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('tagsInputList', JSON.stringify(tagsInputList));
  // }, [tagsInputList]);

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
        {/* <ToggleButton value="Summarize">Sum</ToggleButton> */}
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth="true"
      >
        {loading ? 'Loading...' : 'Remix It!'}
      </Button>
    </div>
  );
}

export default SentenceRemixer;
