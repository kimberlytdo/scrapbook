import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { spacing } from '@mui/system';
import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { historyAtom, outputAtom } from '../state'; // Import historyAtom and outputAtom from state.js
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SavedRemix() {
  const [history] = useAtom(historyAtom);
  const [output] = useAtom(outputAtom);

  // test stub
  // const history = [
  //   {
  //     mode: 'Remix',
  //     input: ['a', 'b'],
  //     date: new Date(),
  //     responses: ['1', '2', '3'],
  //   },
  //   {
  //     mode: 'Test',
  //     input: ['a', 'b'],
  //     date: new Date(),
  //     responses: ['1', '2', '3'],
  //   },
  // ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    console.log("Copied text:", text);
  };

  return (
    <div>
      {history
        .slice()
        .reverse()
        .map((item, index) => (
          <Card key={index} sx={{ mb: '1rem' }}>
            <CardHeader
              title={<Typography variant="subtitle1">{item.mode}</Typography>}
              subheader={
                <Typography variant="caption">
                  {new Date(item.date).toLocaleString()}
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                {item.input.map((content, inputIndex) => (
                  <Chip
                    index={inputIndex}
                    label={content}
                    onClick={() => handleCopy(content)}
                    sx={{
                      height: 'auto',
                      '& .MuiChip-label': {
                        display: 'block',
                        whiteSpace: 'normal',
                        padding: '10px',
                      },
                    }}
                    icon={<ContentCopy fontSize='small' />}
                  />
                ))}
              </Stack>
              <List>
                {item.responses.map((response, responseIndex) => (
                  <ListItemButton
                    key={responseIndex}
                    onClick={() => handleCopy(response)}
                  >
                    <ListItemIcon>
                      <ContentCopy />
                    </ListItemIcon>
                    <ListItemText
                      primary={`AI Suggestion ${responseIndex + 1}`}
                      secondary={response}
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
