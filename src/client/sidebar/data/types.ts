export interface InspoRecord {
  id: number,
  sourceDocumentName: string, // source document
  content: string,
  isBookmarked: boolean
}

export interface WebInspoRecord extends InspoRecord {
  url: string
}

export interface SystemHistory {
  mode: 'Paraphrase' | 'Summarize' | 'Simplify' | 'Combine';
  date: Date;
  input: string[];
  responses: string[];
}