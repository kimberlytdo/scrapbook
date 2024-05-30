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

function CurrentInspo() {
  const [inspoText, setInspoText] = useAtom(currentInspoTextAtom);
  const options = ['Copy', 'Edit', 'Delete'];

  const [history, setHistory] = useAtom(InspoHistoryAtom);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event, text) => {
    console.log(event, text)
    if (event === 'Edit') {
      handleEdit(text)
    } else if (event === 'Delete') {
      handleDelete(text);
    } else if (event === 'Copy') {
      console.log("copy")
    }
  };

  const handleEdit = (text) => {
    setHistory((prev) => prev.filter((item) => item !== text));
    setInspoText(text)

  }

  const handleDelete = (text) => {
    // console.log(text);
    setHistory((prev) => prev.filter((item) => item !== text));
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {history.map((historyText) => {
        return (
          <ListItem>
            <ListItemText>{historyText}</ListItemText>
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    selected={option === 'Pyxis'}
                    onClick={handleClose}
                  >
                    <ListItemText onClick={() => handleMenuItemClick(option, historyText)}>{option}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}

export default CurrentInspo;
