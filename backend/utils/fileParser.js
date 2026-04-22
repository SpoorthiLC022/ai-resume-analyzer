const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseResumeFile = async (filePath, mimetype) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } 
    else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = result.value;
    } 
    else {
      throw new Error(`Unsupported file type: ${mimetype}. Only PDF and DOCX are allowed.`);
    }

    return extractedText.trim();
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse resume file');
  }
};

module.exports = { parseResumeFile };
