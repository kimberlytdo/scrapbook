import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import { numSuggestionsAtom } from '../state';

export default function NumSuggestions() {
  const [numSuggestions, setNumSuggestions] = useAtom(numSuggestionsAtom);

  const handleSliderChange = (event, newValue) => {
    setNumSuggestions(newValue);
  };

  const defaultNumSuggestions = process.env.REACT_APP_OPENAI_MODEL.startsWith('chatgpt') ? 3 : 1;

  React.useEffect(() => {
    if (numSuggestions === undefined || numSuggestions === null) {
      setNumSuggestions(defaultNumSuggestions);
    }
  }, [setNumSuggestions, numSuggestions, defaultNumSuggestions]);

  return (
    <div>
      <Typography variant="caption">Select the number of AI suggestions created after each sentence remix</Typography>
      <Box sx={{ width: 'auto' }}>
        <Slider
          aria-label="Number of Suggestions"
          defaultValue={defaultNumSuggestions}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
          value={numSuggestions}
          onChange={handleSliderChange}
        />
      </Box>
    </div>
  );
}
