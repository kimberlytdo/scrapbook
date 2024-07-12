import * as React from 'react';
import { useState } from 'react';
import {
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { atom, useAtom } from 'jotai';
import { InspoHistoryAtom, currentInspoTextAtom } from '../../data/InspoData';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function EditableTextarea({ record }) {
  const [isEditable, setIsEditable] = useState(false);
  const [currentRecord, setcurrentRecord] = useState(record);
  const [tracebackRecord, settracebackRecord] = useState(record);

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
      setIsEditable(true);
    } else if (event === 'Delete') {
      handleDelete(text);
    } else if (event === 'Copy') {
      handleCopy(text);
    }
  };

  const handleCopy = (record) => {
    navigator.clipboard.writeText(record.content);
  };

  const handleEdit = (prevText) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item === prevText) {
          return currentRecord;
        }
        return item;
      })
    );
    settracebackRecord(currentRecord);
    console.log(history);
    setIsEditable(false);
  };

  const handleDelete = (text) => {
    setHistory((prev) => prev.filter((item) => item !== text));
  };

  return (
    <div>
      <Box sx={{ display: 'inline-flex' }}>
        <TextField
          disabled={!isEditable}
          multiline
          rows={1}
          onChange={(e, currentRecord) => {
            let newContent = {
              ...currentRecord,
              content: e.target.value,
            }
            setcurrentRecord(newContent)
          }}
          value={currentRecord.content}
          // onSubmit={setIsEditable(false)}
        ></TextField>
        {isEditable ? (
          <>
            <IconButton onClick={() => handleEdit(tracebackRecord)}>
              <CheckIcon />
            </IconButton>
          </>
        ) : (
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
                  <ListItemText
                    onClick={() => handleMenuItemClick(option, currentRecord)}
                  >
                    {option}
                  </ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </div>
        )}
      </Box>
    </div>
  );
}
