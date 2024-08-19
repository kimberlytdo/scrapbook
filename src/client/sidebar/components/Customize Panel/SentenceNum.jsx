// NumSuggestions.jsx
import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useAtom } from 'jotai';
import Typography from '@mui/material/Typography';
import { sentenceNumAtom } from '../state';

export default function SentenceNum() {
  const [sentenceNum, setSentenceNum] = useAtom(sentenceNumAtom);

  const handleSliderChange = (event, newValue) => {
    setSentenceNum(newValue);
  };

  return (
    <div>
      <Typography variant="caption">Select the maximum number of sentences given per remix suggestion</Typography>
      <Box sx={{ width: 'auto' }}>
        <Slider
          aria-label="Length of Suggestion"
          defaultValue={3}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={5}
          value={sentenceNum}
          onChange={handleSliderChange}
        />
      </Box>
    </div>
  );
}
