// NumSuggestions.jsx
import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useAtom } from 'jotai';
import Typography from '@mui/material/Typography';
import { numSuggestionsAtom } from '../state';

export default function NumSuggestions() {
  const [numSuggestions, setNumSuggestions] = useAtom(numSuggestionsAtom);

  const handleSliderChange = (event, newValue) => {
    setNumSuggestions(newValue);
  };

  const defaultNumSuggestionSpec =
    process.env.REACT_APP_OPENAI_MODEL.startsWith('chatgpt') ?
    {
      defaultSuggestionNum: 3,
      adjustment: true,
    }:
    {
      defaultSuggestionNum: 1,
      adjustment: false,
    }

  if (!process.env.REACT_APP_OPENAI_MODEL.startsWith('chatgpt')) {
    // override chatgpt setting if using other OPENAI-compatible APIs
    setNumSuggestions(defaultNumSuggestionSpec.defaultSuggestionNum);
  }

  return (
    <div>
      <Typography variant="caption">Select the number of AI suggestions created after each sentence remix</Typography>
      <Box sx={{ width: 'auto' }}>
        <Slider
          aria-label="Number of Suggestions"
          defaultValue={defaultNumSuggestionSpec.defaultSuggestionNum}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
          value={numSuggestions}
          onChange={handleSliderChange}
          disabled={!defaultNumSuggestionSpec.adjustment}
        />
      </Box>
    </div>
  );
}
