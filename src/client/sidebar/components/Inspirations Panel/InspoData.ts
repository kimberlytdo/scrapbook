import { atom, useAtom } from 'jotai';
import { InspoRecord } from './types';
import { serverFunctions } from '../../../utils/serverFunctions';

export const InspoHistoryAtom = atom<InspoRecord[]>([]);
export const currentInspoTextAtom = atom<string>('');
export const IDAtom = atom<number>(0);

export const addRecord = (history: InspoRecord[], text: string, documentName: string) => {
  // get current system time
  let time: number = new Date().getTime();
  let newRecord: InspoRecord = {
    id: time,
    sourceDocumentName: documentName,
    content: text,
  };
  return (prevRecord: InspoRecord[]) => [...history, newRecord];
};
