// Get the URL bar and bookmarks from the main window
async function initializeToolbar() {
  // Get the main window
  const mainWindow = await browser.windows.getCurrent();

  // Get the active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  // Get bookmarks
  const bookmarks = await browser.bookmarks.getChildren("toolbar_____");

  // Create URL bar
  const urlContainer = document.getElementById("url-container");
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.value = activeTab.url;
  urlInput.placeholder = "Enter URL or search...";
  urlInput.style.width = "100%";
  urlInput.style.padding = "8px";
  urlInput.style.border = "1px solid #ddd";
  urlInput.style.borderRadius = "4px";
  urlInput.style.boxSizing = "border-box";
  urlContainer.appendChild(urlInput);

  // Create bookmarks
  const bookmarksContainer = document.getElementById("bookmarks-container");
  bookmarks.forEach((bookmark) => {
    if (bookmark.url) {
      const bookmarkElement = document.createElement("a");
      bookmarkElement.href = bookmark.url;
      bookmarkElement.textContent = bookmark.title || bookmark.url;
      bookmarkElement.style.display = "inline-block";
      bookmarkElement.style.padding = "6px 12px";
      bookmarkElement.style.background = "#f0f0f0";
      bookmarkElement.style.borderRadius = "4px";
      bookmarkElement.style.textDecoration = "none";
      bookmarkElement.style.color = "#333";
      bookmarkElement.style.fontSize = "13px";
      bookmarkElement.style.whiteSpace = "nowrap";
      bookmarkElement.style.overflow = "hidden";
      bookmarkElement.style.textOverflow = "ellipsis";
      bookmarkElement.style.maxWidth = "200px";

      // Open in new tab
      bookmarkElement.addEventListener("click", (e) => {
        e.preventDefault();
        browser.tabs.create({ url: bookmark.url });
      });

      bookmarksContainer.appendChild(bookmarkElement);
    }
  });

  // Handle URL input
  urlInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      let url = e.target.value.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      await browser.tabs.create({ url: url });
    }
  });
}

// Initialize the toolbar
initializeToolbar();
