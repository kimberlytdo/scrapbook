import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { docInfoAtom } from '../state'; // Import docInfoAtom from state.js

export default function DocInfoCustom() {
  const [docInfo, setDocInfo] = useAtom(docInfoAtom);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDocInfo((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <Stack spacing={2}>
        <TextField
          id="title"
          label="Document Title"
          type="search"
          helperText="Enter the name of your document"
          value={docInfo.title}
          onChange={handleChange}
        />
        <TextField
          id="audience"
          label="Document Audience"
          type="search"
          helperText="Customize your audience (e.g., admissions committee, professors, students)"
          value={docInfo.audience}
          onChange={handleChange}
        />
        <TextField
          id="tone"
          label="Writing Tone"
          type="search"
          helperText="Customize your writing tone (e.g., formal, casual, business)"
          value={docInfo.tone}
          onChange={handleChange}
        />
        <TextField
          id="style"
          label="Writing Style"
          type="search"
          helperText="Customize your writing style (e.g., narrative, expository, descriptive)"
          value={docInfo.style}
          onChange={handleChange}
        />

      <TextField
          id="prompt"
          label="Writing Prompt"
          type="search"
          helperText="Specify the writing prompt associated with your document"
          value={docInfo.prompt}
          onChange={handleChange}
          rows={4}
          multiline
        />
      </Stack>
    </div>
  );
}
