import { atom, useAtom } from 'jotai';
import { InspoRecord } from './types';
import { serverFunctions } from '../../utils/serverFunctions';

export const InspoHistoryAtom = atom<InspoRecord[]>([]);
export const currentInspoTextAtom = atom<string>('');
export const IDAtom = atom<number>(0);