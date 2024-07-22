import React from 'react';
import {
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  IconButton,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom } from '../../data/InspoData';
import EditableTextarea from './EditableTextarea';

function CurrentInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding:'0' }}>
      {history.map((currentRecord) => {
        return (
          <ListItem key={currentRecord.id} fullWidth="true" width="100%" sx={{width: "100%"}}>
            <EditableTextarea record={currentRecord} />
            {/* <ListItemText>{historyText}</ListItemText> */}
          </ListItem>
        );
      })}
    </List>
  );
}

export default CurrentInspo;
