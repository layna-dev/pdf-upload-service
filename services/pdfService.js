const { PDFParse } = require('pdf-parse');

async function extractText(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = result.text
      .replace(/-- \d+ of \d+ --/g, '')   // remove page markers
      .replace(/\n{3,}/g, '\n\n')         // remove extra blank lines
      .trim();
    if (!text) throw new Error('No readable text found in this PDF (it may be a scanned image).');
    return { text, pages: result.total };
  } finally {
    await parser.destroy();
  }
}

module.exports = { extractText };