/**
 * JCTEF website → Google Sheet
 *
 * Receives form submissions from jctef.org and adds each one as a row.
 * Paste this whole file into Extensions → Apps Script in the JCTEF
 * submissions sheet. See README.md in this folder for the full steps.
 *
 * The website sends:  { "secret": "...", "form": "volunteer", "data": { "First name": "Ada", ... } }
 * The keys in "data" are the column headings. A heading the sheet doesn't
 * have yet is added as a new column at the end, so nothing is ever lost.
 *
 * The password (SECRET) lives in Project Settings → Script Properties,
 * never in this file.
 */

/** Which tab each form writes to, and its columns in order. */
var TABS = {
  volunteer: {
    name: 'Volunteers',
    headers: [
      'Submitted at', 'First name', 'Last name', 'Email', 'Phone', 'Location',
      'Volunteering as', 'Facilitation areas', 'Availability', 'Experience',
      'Motivation', 'Status',
    ],
  },
  partner: {
    name: 'Partners',
    headers: [
      'Submitted at', 'Full name', 'Organisation', 'Role', 'Email', 'Phone',
      'Organisation type', 'Areas of interest', 'Website', 'Message', 'Status',
    ],
  },
  contact: {
    name: 'Contact messages',
    headers: ['Submitted at', 'Name', 'Email', 'Phone', 'Message', 'Status'],
  },
};

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret) return reply_({ ok: false, error: 'SECRET is not set in Script Properties' });
    if (typeof body.secret !== 'string' || body.secret !== secret) {
      return reply_({ ok: false, error: 'Unauthorised' });
    }

    var tab = TABS[body.form];
    if (!tab) return reply_({ ok: false, error: 'Unknown form: ' + body.form });

    var data = body.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return reply_({ ok: false, error: 'Missing data' });
    }

    // One submission at a time, so two arriving together can't overwrite each other.
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      var sheet = getOrCreateTab_(tab);
      var headers = ensureColumns_(sheet, Object.keys(data));
      var row = headers.map(function (heading) {
        var value = data[heading];
        return value === undefined || value === null ? '' : String(value);
      });
      sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    return reply_({ ok: true });
  } catch (error) {
    return reply_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

/** Finds the tab, or creates it with a bold, frozen header row. */
function getOrCreateTab_(tab) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(tab.name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(tab.name);
    sheet.getRange(1, 1, 1, tab.headers.length).setValues([tab.headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Returns the header row, adding any new headings as columns at the end. */
function ensureColumns_(sheet, keys) {
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
  // A tab that exists but is empty: drop the blank first cell.
  if (headers.length === 1 && headers[0] === '') headers = [];

  var added = keys.filter(function (key) {
    return headers.indexOf(key) === -1;
  });
  if (added.length) {
    sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
    headers = headers.concat(added);
    if (sheet.getFrozenRows() === 0) sheet.setFrozenRows(1);
  }
  return headers;
}

function reply_(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: run this once from the editor (select "testSetup" → Run) to
 * check the tabs are created. It doesn't need the SECRET.
 */
function testSetup() {
  Object.keys(TABS).forEach(function (form) {
    getOrCreateTab_(TABS[form]);
  });
}
