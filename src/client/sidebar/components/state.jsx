import { atom } from 'jotai';

export const inputAtom = atom('');
export const outputAtom = atom([]);
export const historyAtom = atom([]);
export const docInfoAtom = atom({
    title: '',
    audience: '',
    tone: '',
    style: '',
  });
export const numSuggestionsAtom = atom(3);
export const copyFirstSentenceAtom = atom(false);
export const pasteFirstSentenceAtom = atom(false);
