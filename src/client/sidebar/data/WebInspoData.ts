import { atom, useAtom } from 'jotai';
import { WebInspoRecord } from './types';
import { serverFunctions } from '../../utils/serverFunctions';

export const WebInspoHistoryAtom = atom<WebInspoRecord[]>([]);
export const currentWebInspoTextAtom = atom<string>('');
export const WebIDAtom = atom<number>(0);