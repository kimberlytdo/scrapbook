export const getDocumentName = () => {
  let name = DocumentApp.getActiveDocument().getName();
  return name
}


export const insertGeneratedText = (insertText: string) => {
  let cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    let element = cursor.insertText(insertText);
    if (!element) {
      DocumentApp.getUi().alert('Cannot insert text here.');
    }
  } else {
    let selection = DocumentApp.getActiveDocument().getSelection();
    if (selection) {
      let elements = selection.getRangeElements();
      let offset = elements[elements.length - 1].getEndOffsetInclusive()
      let element = elements[elements.length - 1].getElement().asText().insertText(offset + 1, insertText);
    }
    else {
      DocumentApp.getUi().alert('Fail to insert test');
    }
  }
};

export const copyInspiration = () => {
  let selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    let elements = selection.getRangeElements();
    let selectionText = elements.map((element) => {
      if (element.isPartial()) {
        let startPos = element.getStartOffset()
        let endPos = element.getEndOffsetInclusive()
        return element.getElement().asText().getText().substring(startPos, endPos + 1) // +1 to include the last character
      }
      else {
        return element.getElement().asText().getText()
      }
    })
    return selectionText.join('')
  } else {
    return ""
  }
}
