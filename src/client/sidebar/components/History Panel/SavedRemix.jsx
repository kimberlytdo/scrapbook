import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; // Use Button instead of Chip
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { ContentCopy } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { historyAtom, outputAtom, tagsInputAtom } from '../state'; // Import historyAtom and outputAtom from state.js

export default function SavedRemix() {
  const [history] = useAtom(historyAtom);
  const [, setTagsInputList] = useAtom(tagsInputAtom);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log("Copied text:", text);
  };

  const handleSendtoRemix = (text) => {
    setTagsInputList((prev) => [...prev, text]); // Save text to tagsInputAtom
    console.log("Sent to remixer text:", text);
  };

  // Styled button to align icons and text
  const StyledButton = styled(Button)({
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    maxWidth: '100%', // Ensure it doesn't exceed the container width
    margin: '2px',
    padding: '10px',
    textAlign: 'left',
    boxShadow: 'none',
    backgroundColor: '#eeeeee', // Light gray color
    color: '#424242', // Text color
    '&:hover': {
      backgroundColor: '#bdbdbd', // Darker gray on hover
    },
    '& .MuiButton-startIcon': {
      marginRight: '8px', // Adjust spacing between icons and text
    },
  });

  return (
    <div>
      {history
        .slice()
        .reverse()
        .map((item, index) => (
          <Card key={index} sx={{ mb: '1rem' }}>
            <CardHeader
              title={<Typography variant="h6">{item.mode}</Typography>}
              subheader={
                <Typography variant="caption">
                  {new Date(item.date).toLocaleString()}
                </Typography>
              }
            />
            <Divider />
            <CardContent>
            {/* <Typography sx={{ paddingBottom: '10px', }}>Remixed Inspiration</Typography> */}
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {item.input.map((content, inputIndex) => (
                  <StyledButton
                    key={inputIndex}
                    startIcon={
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleCopy(content)} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleSendtoRemix(content)} size="small">
                          <ShuffleIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                    onClick={() => handleCopy(content)}
                    variant="contained"
                    size="small"
                    sx={{ 
                      height: 'auto',
                      textTransform: 'none',
                      fontWeight: '400',
                      '& .MuiButton-startIcon': {
                        marginRight: '8px',
                      },
                    }}
                  >
                    {content}
                  </StyledButton>
                ))}
              </Stack>
              {/* <Typography sx={{ paddingTop: '20px', }}>AI Suggestions</Typography> */}

<Divider sx={{marginTop:'10px'}}></Divider>
              <List>
                {item.responses.map((response, responseIndex) => (
                  <ListItemButton key={responseIndex} onClick={() => handleCopy(response)}>
                    <ListItemIcon sx={{ minWidth: 75 }}>
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleCopy(response)} size="small">
                          <ContentCopy fontSize="body2" />
                        </IconButton>
                        <IconButton onClick={() => handleSendtoRemix(response)} size="small">
                          <ShuffleIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </ListItemIcon>
                    <ListItemText
                      secondary={response} sx={{ fontSize: '15px'}}
                    />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
