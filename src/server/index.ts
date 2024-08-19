import {
  onOpen,
  openSidebar,
} from './ui';

import {
  insertGeneratedText,
  copyInspiration,
  getDocumentText,
  getDocumentName
} from "./doc"

import { logToCloud, testLogging } from "./log"

// Public functions must be exported as named exports
export {
  onOpen,
  openSidebar,
  insertGeneratedText,
  copyInspiration,
  getDocumentName,
  getDocumentText
};

export {
  logToCloud,
  testLogging
};
