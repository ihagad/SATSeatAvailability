function scrapeDropdownDates() {
  const dropdown = document.querySelector("select"); // or more specific selector if needed
  if (!dropdown) return;

  const options = dropdown.querySelectorAll("option");
  const dates = Array.from(options).map(opt => ({
    label: opt.textContent.trim(),
    value: opt.value.trim()
  }));

  console.log("Scraped test dates:", dates);

  chrome.runtime.sendMessage({ type: "SAT_DATES", data: dates });
}

// Wait if page is dynamic
const observer = new MutationObserver(() => {
  const dropdown = document.querySelector("select");
  if (dropdown) {
    scrapeDropdownDates();
    observer.disconnect();
  }
});

observer.observe(document, { childList: true, subtree: true });