# SAT Seat Availability Chrome Extension

## Overview

This Chrome Extension monitors SAT test center availability and alerts users when seats become available at selected locations. It's designed to help students secure their desired test dates more efficiently by automating the process of checking the College Board website.

---

## Features

- Select preferred test centers and dates
- Periodic checks for seat availability
- Real-time alerts when a seat opens up
- Cached preferences to reduce redundant alerts

---

## Getting Started

### 1. Download Test Dates

Before using the extension, you must **manually fetch SAT test dates**:

1. Visit the [College Board SAT Registration Page](https://satsuite.collegeboard.org/sat/registration/test-center-availability).
2. Select your region, enter a zip code, and choose a radius.
3. Copy the available test dates and centers.
4. Paste them into the extension when prompted (or follow internal instructions if automated scraping is integrated).

> ⚠️ College Board does not currently offer a public API, so initial test date selection requires manual action.

---

### 2. Load the Extension in Chrome

1. Open `chrome://extensions` in your Chrome browser.
2. Enable **Developer Mode** (top right).
3. Click **Load unpacked** and select your project directory.
4. The extension should now appear in your browser.

---

### 3. Set Your Preferences

1. Click the extension icon to open the popup.
2. Select your preferred test centers and dates.
3. Adjust the search radius if applicable.
4. Click **Save Preferences**.

---

### 4. How It Works

- The extension stores your selected preferences locally (`chrome.storage.local`).
- It periodically checks for updates (based on the current setup in `background.js`).
- If a seat becomes available, you’ll receive a **Chrome notification**.

---

## Development

The core components of the extension include:

- `manifest.json`: Chrome extension metadata and permissions.
- `background.js`: Handles periodic seat checking and caching.
- `popup.html` + `popup.js`: UI for selecting preferences.
- `fetchAvailableSeats.js`: API/scraper logic to fetch available seats.

---

## Notes

- Ensure you visit the College Board site to verify any changes to test dates.
- This project is not affiliated with or endorsed by the College Board.
- Availability data and notifications are based on public information at the time of fetch.

---

## License

This project is for educational use only. All rights to data and content from College Board remain with them.