import pdfParse from 'pdf-parse';

export async function parsePDF(buffer) {
  return pdfParse(buffer);
}
