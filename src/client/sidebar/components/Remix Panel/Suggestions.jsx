import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { outputAtom } from '../state'; // Import the atom from state.js

function Suggestions() {
  const [output] = useAtom(outputAtom);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log("Copied text:", text);
  };

  return (
    <div>
      <List>
        {output.map((sentence, index) => (
          <ListItemButton key={index} onClick={() => handleCopy(sentence)}>
            <ListItemIcon>
              <ContentCopy />
            </ListItemIcon>
            {/* <ListItemText primary={`Sentence ${index + 1}`} secondary={sentence} /> */}
            <ListItemText secondary={sentence} />

          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

export default Suggestions;
