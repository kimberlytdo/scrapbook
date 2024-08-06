import React from'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import { useAtom } from 'jotai';
import { copyFirstSentenceAtom, pasteFirstSentenceAtom } from '../state';

export default function SentenceRemixCustom() {
    const [copyFirstSentence, setCopyFirstSentence] = useAtom(copyFirstSentenceAtom);

    const handleCopySwitchChange = (event) => {
      setCopyFirstSentence(event.target.checked);
    };

    const [pasteFirstSentence, setPasteFirstSentence] = useAtom(pasteFirstSentenceAtom);

    const handlePasteSwitchChange = (event) => {
      setPasteFirstSentence(event.target.checked);
    };
    
    return (
        <div>
            <FormGroup>
            {/* <FormControlLabel control={<Switch checked={pasteFirstSentence} onChange={handlePasteSwitchChange} />} label="Paste first remixed sentence directly into document" /> */}
            <FormControlLabel 
          control={<Switch checked={copyFirstSentence} onChange={handleCopySwitchChange} />} 
          label="Copy the first remixed sentence directly into the clipboard" 
        />
            <Tooltip title="Remixes will be contextually fine-tuned to text you've selected">
            <FormControlLabel control={<Switch />} label="Suggest remixes based on what I'm currently typing" /></Tooltip>
            </FormGroup>
        </div>
    )
};