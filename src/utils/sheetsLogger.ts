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
  // Don't log if URL is not configured (check for placeholder)
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
    console.warn('Google Sheets logging is not configured. Please set GOOGLE_SCRIPT_URL in sheetsLogger.ts');
    return;
  }

  try {
    // Build URL-encoded query string (works best with no-cors and Google Apps Script)
    const params = new URLSearchParams();
    params.append('studentName', data.studentName);
    params.append('studentId', data.studentId);
    params.append('targetPhoneme', data.targetPhoneme);
    params.append('targetWord', data.targetWord);
    params.append('recognizedText', data.recognizedText);
    params.append('accuracyScore', data.accuracyScore.toString());
    params.append('confidenceScore', data.confidenceScore.toString());
    params.append('timestamp', data.timestamp);
    params.append('userAgent', data.userAgent);
    params.append('timeTakenMs', data.timeTakenMs.toString());

    const queryString = params.toString();
    
    console.log('Logging to Google Sheets:', {
      studentName: data.studentName,
      targetWord: data.targetWord,
      accuracy: data.accuracyScore,
      url: GOOGLE_SCRIPT_URL
    });

    // Send with no-cors mode using GET method (more reliable with Google Apps Script)
    // Google Apps Script can read query parameters from both GET and POST
    const urlWithParams = `${GOOGLE_SCRIPT_URL}?${queryString}`;
    
    await fetch(urlWithParams, {
      method: 'GET', // Use GET for no-cors (more reliable)
      mode: 'no-cors', // Required for Google Apps Script
    });

    console.log('Practice attempt logged to Google Sheets (request sent)');
  } catch (error) {
    // Log error but don't interrupt user experience
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
 * function doGet(e) {
 *   return doPost(e);
 * }
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
 *     // Get parameters (works with both GET query params and POST form data)
 *     var parameters = e.parameter || {};
 *     
 *     var studentName = parameters.studentName || '';
 *     var studentId = parameters.studentId || '';
 *     var targetPhoneme = parameters.targetPhoneme || '';
 *     var targetWord = parameters.targetWord || '';
 *     var recognizedText = parameters.recognizedText || '';
 *     var accuracyScore = parameters.accuracyScore || '0';
 *     var confidenceScore = parameters.confidenceScore || '0';
 *     var timestamp = parameters.timestamp || new Date().toISOString();
 *     var userAgent = parameters.userAgent || '';
 *     var timeTakenMs = parameters.timeTakenMs || '0';
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
 *     Logger.log('Error in doPost: ' + error.toString());
 *     return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */
