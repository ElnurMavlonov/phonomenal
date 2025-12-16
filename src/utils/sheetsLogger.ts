// Google Sheets Logger Utility
// This function sends practice attempt data to a Google Apps Script Web App

export interface PracticeAttemptData {
  studentName: string;
  studentId: string;
  targetPhoneme: string;
  targetWord: string;
  recognizedText: string;
  accuracyScore: number;
  confidenceScore: number;
  timestamp: string;
  userAgent: string;
  timeTakenMs: number;
}

// Google Apps Script Web App URL - Replace with your deployed script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4wgI8o7ni75k9UcU1nz_58cgpoFBiPC7OSRUV2e5b27NS635UxVxthdTzv4ebkX70Jw/exec';

/**
 * Logs a practice attempt to Google Sheets
 * Uses no-cors mode to avoid CORS issues with Google Apps Script
 */
export async function logAttemptToSheets(data: PracticeAttemptData): Promise<void> {
  // Don't log if URL is not configured
  if (GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbx4wgI8o7ni75k9UcU1nz_58cgpoFBiPC7OSRUV2e5b27NS635UxVxthdTzv4ebkX70Jw/exec') {
    console.warn('Google Sheets logging is not configured. Please set GOOGLE_SCRIPT_URL in sheetsLogger.ts');
    return;
  }

  try {
    // Use FormData for no-cors requests
    const formData = new FormData();
    formData.append('studentName', data.studentName);
    formData.append('studentId', data.studentId);
    formData.append('targetPhoneme', data.targetPhoneme);
    formData.append('targetWord', data.targetWord);
    formData.append('recognizedText', data.recognizedText);
    formData.append('accuracyScore', data.accuracyScore.toString());
    formData.append('confidenceScore', data.confidenceScore.toString());
    formData.append('timestamp', data.timestamp);
    formData.append('userAgent', data.userAgent);
    formData.append('timeTakenMs', data.timeTakenMs.toString());

    // Send with no-cors mode (can't read response, but data is sent)
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      body: formData,
    });

    console.log('Practice attempt logged to Google Sheets');
  } catch (error) {
    // Silently fail - we don't want to interrupt the user experience
    console.error('Failed to log to Google Sheets:', error);
  }
}

/**
 * Google Apps Script doPost function (to be deployed as Web App)
 * 
 * Instructions:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Paste the code below
 * 4. Save and deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 5. Copy the Web App URL and replace GOOGLE_SCRIPT_URL above
 * 
 * Code to paste in Google Apps Script:
 * 
 * function doPost(e) {
 *   try {
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     
 *     // Create header row if it doesn't exist
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow([
 *         'Timestamp',
 *         'Student Name',
 *         'Student ID',
 *         'Target Phoneme',
 *         'Target Word',
 *         'Recognized Text',
 *         'Accuracy Score',
 *         'Confidence Score',
 *         'User Agent',
 *         'Time Taken (ms)'
 *       ]);
 *     }
 *     
 *     // Get form data
 *     var studentName = e.parameter.studentName || '';
 *     var studentId = e.parameter.studentId || '';
 *     var targetPhoneme = e.parameter.targetPhoneme || '';
 *     var targetWord = e.parameter.targetWord || '';
 *     var recognizedText = e.parameter.recognizedText || '';
 *     var accuracyScore = e.parameter.accuracyScore || '0';
 *     var confidenceScore = e.parameter.confidenceScore || '0';
 *     var timestamp = e.parameter.timestamp || new Date().toISOString();
 *     var userAgent = e.parameter.userAgent || '';
 *     var timeTakenMs = e.parameter.timeTakenMs || '0';
 *     
 *     // Append row to sheet
 *     sheet.appendRow([
 *       timestamp,
 *       studentName,
 *       studentId,
 *       targetPhoneme,
 *       targetWord,
 *       recognizedText,
 *       parseFloat(accuracyScore),
 *       parseFloat(confidenceScore),
 *       userAgent,
 *       parseInt(timeTakenMs)
 *     ]);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({success: true}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */
