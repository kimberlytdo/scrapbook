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
import { InspoHistoryAtom, currentInspoTextAtom } from './InspoData';
import EditableTextarea from './EditableTextarea';

function CurrentInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const [history, setHistory] = useAtom(InspoHistoryAtom);

  const options = ['Copy', 'Edit', 'Delete'];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, text) => {
    if (event === 'Edit') {
      handleEdit(text);
    } else if (event === 'Delete') {
      handleDelete(text);
    } else if (event === 'Copy') {
      handleCopy(text);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleEdit = (prevText, currentText) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item === prevText) {
          return currentText;
        }
        return item;
      })
    );
  };

  const handleDelete = (text) => {
    setHistory((prev) => prev.filter((item) => item !== text));
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {history.map((historyText) => {
        return (
          <ListItem key={historyText}>
            <EditableTextarea text={historyText} />
            {/* <ListItemText>{historyText}</ListItemText> */}
          </ListItem>
        );
      })}
    </List>
  );
}

export default CurrentInspo;
