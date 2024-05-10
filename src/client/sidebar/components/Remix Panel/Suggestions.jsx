import React, { useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import axios from 'axios';

function Suggestions() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    setCopied(true);
  };

  const triggerAPI = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Randomly say either cat or dog', // Placeholder message
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer %OPENAPI KEY', // Replace with your OpenAI API key
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      document.getElementById('api_response').innerText = botReply;
    } catch (error) {
      console.error('Error triggering API:', error);
    }
  };

  return (
    <div>
      <List>
        <ListItemButton onClick={() => handleCopy("AI Suggestion 1")}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText primary="AI Suggestion 1" />
        </ListItemButton>
        <ListItemButton onClick={() => handleCopy("AI Suggestion 2")}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText primary="AI Suggestion 2" />
        </ListItemButton>
        <ListItemButton onClick={() => handleCopy("AI Suggestion 3")}>
          <ListItemIcon>
            <ContentCopy />
          </ListItemIcon>
          <ListItemText primary="AI Suggestion 3" />
        </ListItemButton>
      </List>
      <button id="trigger_api" onClick={triggerAPI}>Trigger API</button>
      <p id="api_response"></p>
    </div>
  );
}

export default Suggestions;


