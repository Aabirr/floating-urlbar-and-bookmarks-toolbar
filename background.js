// Handle messages from content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    browser.bookmarks.getChildren("toolbar_____").then(sendResponse);
    return true;
  }
  if (request.action === "getBookmarksChildren") {
    browser.bookmarks.getChildren(request.id).then(sendResponse);
    return true;
  }
  if (request.action === "openInNewTab") {
    browser.tabs.create({ url: request.url });
  }
  if (request.action === "searchBookmarks") {
    browser.bookmarks.search(request.query).then(sendResponse);
    return true;
  }
  if (request.action === "searchHistory") {
    browser.history
      .search({ text: request.query, maxResults: 10 })
      .then(sendResponse);
    return true;
  }
  if (request.action === "getSearchSuggestions") {
    fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(request.query)}`,
    )
      .then((response) => response.json())
      .then((data) => sendResponse(data[1] || []))
      .catch((error) => {
        console.error("Error fetching search suggestions:", error);
        sendResponse([]);
      });
    return true;
  }
});

// Handle keyboard shortcut
browser.commands.onCommand.addListener((command) => {
  if (command === "toggle-toolbar") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: "toggleToolbar" });
      }
    });
  }
});

// Create a floating window for the toolbar
async function createFloatingToolbar() {
  // Get the main window
  const mainWindow = await browser.windows.getCurrent();

  // Create a new window for the toolbar
  const toolbarWindow = await browser.windows.create({
    url: "toolbar.html",
    type: "popup",
    width: 800,
    height: 100,
    left: mainWindow.left + 100,
    top: mainWindow.top + 100,
  });

  return toolbarWindow;
}
