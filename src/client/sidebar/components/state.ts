import { atom } from 'jotai';
import { InspoRecord, SystemHistory } from '../data/types';

export const outputAtom = atom([]);
export const historyAtom = atom<SystemHistory[]>([]);
export const docInfoAtom = atom({
    title: '',
    audience: '',
    tone: '',
    style: '',
    prompt: '',
  });
export const numSuggestionsAtom = atom(3);
export const sentenceNumAtom = atom(2);
export const copyFirstSentenceAtom = atom(false);
export const contextRemixAtom = atom(false);
export const pasteFirstSentenceAtom = atom(false);

export const tagsInputAtom = atom<string[]>([]);
export const BookmarkedAtom = atom<InspoRecord[]>([])
