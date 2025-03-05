const { google } = require('googleapis');
const credentials = require('../config/credentials');

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  credentials.google.clientId,
  credentials.google.clientSecret,
  credentials.google.redirectUri
);

// Scopes for Google Docs API access
const SCOPES = [
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

// Get authentication URL
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
};

// Exchange authorization code for tokens
const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Set credentials for OAuth2 client
const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
};

// List documents from Google Drive
const listDocs = async (authClient) => {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.document'",
    fields: 'files(id, name)',
    spaces: 'drive'
  });
  return res.data.files || [];
};

// Get document content
const getDocContent = async (authClient, docId) => {
  const docs = google.docs({ version: 'v1', auth: authClient });
  const doc = await docs.documents.get({ documentId: docId });
  
  // Extract text content from the document
  let content = '';
  const { body } = doc.data;
  if (body && body.content) {
    body.content.forEach(item => {
      if (item.paragraph) {
        item.paragraph.elements.forEach(element => {
          if (element.textRun) {
            content += element.textRun.content;
          }
        });
      }
    });
  }
  
  return {
    title: doc.data.title,
    content: content
  };
};

module.exports = {
  getAuthUrl,
  getTokens,
  setCredentials,
  listDocs,
  getDocContent,
  oauth2Client
};
