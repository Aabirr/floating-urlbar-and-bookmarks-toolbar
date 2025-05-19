// Inject a floating toolbar into the page
(function () {
  if (window.__floatingBookmarkToolbarInjected) return;
  window.__floatingBookmarkToolbarInjected = true;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "floating-bookmark-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.0)";
  overlay.style.zIndex = "2147483647";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.pointerEvents = "auto";
  overlay.style.display = "flex";
  overlay.style.visibility = "hidden";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.2s, visibility 0.2s";

  // Centered toolbar container
  const toolbar = document.createElement("div");
  toolbar.id = "floating-bookmark-toolbar";
  toolbar.style.background = "rgba(255,255,255,0.7)";
  toolbar.style.backdropFilter = "blur(24px)";
  toolbar.style.backgroundClip = "padding-box";
  toolbar.style.border = "1px solid ButtonBorder";
  toolbar.style.borderRadius = "16px";
  toolbar.style.padding = "32px";
  toolbar.style.boxShadow = "0 4px 32px rgba(0,0,0,0.18)";
  toolbar.style.minWidth = "min(800px, 90vw)";
  toolbar.style.maxWidth = "90vw";
  toolbar.style.minHeight = "400px";
  toolbar.style.maxHeight = "80vh";
  toolbar.style.display = "flex";
  toolbar.style.flexDirection = "column";
  toolbar.style.alignItems = "center";
  toolbar.style.justifyContent = "flex-start";
  toolbar.style.pointerEvents = "auto";
  toolbar.style.color = "CanvasText";
  toolbar.style.boxSizing = "border-box";
  toolbar.style.colorScheme = "light dark";

  // URL bar wrapper
  const urlBarWrapper = document.createElement("div");
  urlBarWrapper.style.display = "flex";
  urlBarWrapper.style.alignItems = "center";
  urlBarWrapper.style.background = "Field";
  urlBarWrapper.style.borderRadius = "8px";
  urlBarWrapper.style.margin = "0 0 24px 0";
  urlBarWrapper.style.width = "90%";
  urlBarWrapper.style.height = "44px";
  urlBarWrapper.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
  urlBarWrapper.style.border = "1px solid ButtonBorder";

  // Search icon
  const searchIcon = document.createElement("span");
  searchIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="#bbb" stroke-width="2"/><line x1="16.4142" y1="16" x2="20" y2="19.5858" stroke="#bbb" stroke-width="2" stroke-linecap="round"/></svg>`;
  searchIcon.style.margin = "0 12px";
  urlBarWrapper.appendChild(searchIcon);

  // URL bar
  const urlBar = document.createElement("input");
  urlBar.type = "text";
  urlBar.placeholder = "Search or enter address";
  urlBar.value = "";
  urlBar.style.flex = "1";
  urlBar.style.height = "36px";
  urlBar.style.background = "transparent";
  urlBar.style.color = "inherit";
  urlBar.style.fontSize = "1.2rem";
  urlBar.style.border = "none";
  urlBar.style.borderRadius = "0";
  urlBar.style.textAlign = "left";
  urlBar.style.outline = "none";
  urlBar.style.letterSpacing = "1px";
  urlBar.style.padding = "0 8px";
  urlBarWrapper.appendChild(urlBar);

  // Go button
  const goBtn = document.createElement("button");
  goBtn.textContent = "Go";
  goBtn.style.height = "32px";
  goBtn.style.margin = "0 12px";
  goBtn.style.background = "ButtonFace";
  goBtn.style.color = "ButtonText";
  goBtn.style.border = "1px solid ButtonBorder";
  goBtn.style.borderRadius = "6px";
  goBtn.style.fontSize = "1rem";
  goBtn.style.cursor = "pointer";
  goBtn.style.padding = "0 16px";
  goBtn.style.transition = "background 0.2s";
  goBtn.onmouseover = () => (goBtn.style.background = "#d0d0d0");
  goBtn.onmouseout = () => (goBtn.style.background = "ButtonFace");
  urlBarWrapper.appendChild(goBtn);

  toolbar.appendChild(urlBarWrapper);

  // Bookmarks title
  const bookmarksTitle = document.createElement("div");
  bookmarksTitle.textContent = "Bookmarks";
  bookmarksTitle.style.fontSize = "2rem";
  bookmarksTitle.style.fontWeight = "500";
  bookmarksTitle.style.margin = "0 0 8px 0";
  bookmarksTitle.style.color = "inherit";
  bookmarksTitle.style.textAlign = "center";
  toolbar.appendChild(bookmarksTitle);

  // Back button (below title, only when inside a folder)
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.display = "none";
  backBtn.style.margin = "0 0 16px 0";
  backBtn.style.alignSelf = "flex-start";
  backBtn.style.background = "ButtonFace";
  backBtn.style.color = "ButtonText";
  backBtn.style.border = "1px solid ButtonBorder";
  backBtn.style.borderRadius = "6px";
  backBtn.style.fontSize = "1rem";
  backBtn.style.cursor = "pointer";
  backBtn.style.padding = "6px 18px";
  backBtn.style.transition = "background 0.2s";
  backBtn.onmouseover = () => (backBtn.style.background = "#d0d0d0");
  backBtn.onmouseout = () => (backBtn.style.background = "ButtonFace");
  backBtn.onclick = function () {
    folderStack.pop();
    if (folderStack.length) {
      renderBookmarks(folderStack[folderStack.length - 1].children);
    } else {
      renderBookmarks(rootNodes);
    }
  };
  toolbar.appendChild(backBtn);

  // Bookmarks grid container
  const bookmarksGrid = document.createElement("div");
  bookmarksGrid.id = "floating-bookmarks-grid";
  bookmarksGrid.style.display = "grid";
  bookmarksGrid.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(90px, 1fr))";
  bookmarksGrid.style.gap = "24px";
  bookmarksGrid.style.justifyItems = "center";
  bookmarksGrid.style.alignItems = "center";
  bookmarksGrid.style.width = "100%";
  bookmarksGrid.style.flex = "1";
  bookmarksGrid.style.overflowY = "auto";
  toolbar.appendChild(bookmarksGrid);

  // Navigation stack for folders
  let folderStack = [];

  // Helper: is likely a URL
  function isProbablyUrl(str) {
    return /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(str);
  }

  // Helper: get domain from url
  function getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }

  // Render bookmarks/folders
  function renderBookmarks(nodes) {
    bookmarksGrid.innerHTML = "";
    // Show/hide back button
    backBtn.style.display = folderStack.length > 0 ? "inline-block" : "none";
    nodes.forEach((node) => {
      const item = document.createElement("div");
      item.style.width = "90px";
      item.style.height = "90px";
      item.style.background = node.url ? "#111" : "#222";
      item.style.borderRadius = "16px";
      item.style.display = "flex";
      item.style.flexDirection = "column";
      item.style.alignItems = "center";
      item.style.justifyContent = "center";
      item.style.fontSize = "0.7rem";
      item.style.color = "#fff";
      item.style.cursor =
        node.url || (!node.url && node.id) ? "pointer" : "default";
      item.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
      item.style.position = "relative";
      item.style.textAlign = "center";
      item.style.overflow = "hidden";
      item.style.padding = "6px";
      if (node.url) {
        // Favicon or first letter
        const domain = getDomain(node.url);
        const iconBg = document.createElement("div");
        iconBg.style.background = "ButtonFace";
        iconBg.style.color = "ButtonText";
        iconBg.style.borderRadius = "8px";
        iconBg.style.width = "48px";
        iconBg.style.height = "48px";
        iconBg.style.display = "flex";
        iconBg.style.alignItems = "center";
        iconBg.style.justifyContent = "center";
        iconBg.style.margin = "8px auto 4px auto";
        iconBg.style.padding = "8px";
        iconBg.style.boxSizing = "border-box";
        iconBg.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
        iconBg.style.colorScheme = "light dark";
        const favicon = document.createElement("img");
        favicon.src = `https://www.google.com/s2/favicons?domain=${domain}`;
        favicon.width = 32;
        favicon.height = 32;
        favicon.style.display = "block";
        favicon.style.borderRadius = "6px";
        favicon.onerror = function () {
          favicon.style.display = "none";
          const fallback = document.createElement("div");
          fallback.textContent = (
            domain[0] ||
            node.title[0] ||
            "?"
          ).toUpperCase();
          fallback.style.width = "32px";
          fallback.style.height = "32px";
          fallback.style.background = "ButtonFace";
          fallback.style.color = "ButtonText";
          fallback.style.borderRadius = "50%";
          fallback.style.display = "flex";
          fallback.style.alignItems = "center";
          fallback.style.justifyContent = "center";
          fallback.style.fontSize = "1.5rem";
          iconBg.appendChild(fallback);
        };
        iconBg.appendChild(favicon);
        item.appendChild(iconBg);
        const label = document.createElement("span");
        label.textContent = node.title || node.url;
        label.style.display = "block";
        label.style.marginTop = "2px";
        label.style.fontSize = "0.8rem";
        label.style.overflow = "hidden";
        label.style.textOverflow = "ellipsis";
        item.appendChild(label);
        item.addEventListener("click", function (e) {
          e.preventDefault();
          browser.runtime.sendMessage({
            action: "openInNewTab",
            url: node.url,
          });
          overlay.style.visibility = "hidden";
          overlay.style.opacity = "0";
        });
      } else if (!node.url && node.id) {
        // Folder icon + name
        item.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 4px auto;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
        const label = document.createElement("span");
        label.textContent = node.title || "Folder";
        label.style.fontWeight = "bold";
        label.style.fontSize = "0.7rem";
        label.style.display = "block";
        label.style.marginTop = "2px";
        item.appendChild(label);
        item.addEventListener("click", async function () {
          const children = await browser.runtime.sendMessage({
            action: "getBookmarksChildren",
            id: node.id,
          });
          node.children = children;
          folderStack.push(node);
          renderBookmarks(children);
        });
      }
      bookmarksGrid.appendChild(item);
    });
    // Show message if folder is empty
    if (nodes.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.textContent = "No items in this folder.";
      emptyMsg.style.color = "#888";
      emptyMsg.style.fontSize = "1.1rem";
      emptyMsg.style.gridColumn = "1 / -1";
      emptyMsg.style.textAlign = "center";
      bookmarksGrid.appendChild(emptyMsg);
    }
  }

  let rootNodes = [];
  async function loadBookmarks() {
    const nodes = await browser.runtime.sendMessage({ action: "getBookmarks" });
    rootNodes = nodes;
    folderStack = [];
    renderBookmarks(nodes);
  }

  // URL bar search/go logic
  function handleUrlBarAction() {
    let val = urlBar.value.trim();
    if (!val) return;
    let url = val;
    if (isProbablyUrl(val)) {
      if (!/^https?:\/\//i.test(val)) url = "https://" + val;
      browser.runtime.sendMessage({ action: "openInNewTab", url });
    } else {
      // Search (Google)
      const searchUrl =
        "https://www.google.com/search?q=" + encodeURIComponent(val);
      browser.runtime.sendMessage({ action: "openInNewTab", url: searchUrl });
    }
    overlay.style.display = "none";
  }

  urlBar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleUrlBarAction();
    }
  });
  goBtn.addEventListener("click", handleUrlBarAction);

  // Hide overlay when clicking outside the toolbar
  overlay.addEventListener("mousedown", function (e) {
    if (e.target === overlay) {
      overlay.style.visibility = "hidden";
      overlay.style.opacity = "0";
    }
  });

  function setToolbarBackground() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      toolbar.style.background = "rgba(30,30,30,0.5)";
    } else {
      toolbar.style.background = "rgba(255,255,255,0.7)";
    }
  }
  setToolbarBackground();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", setToolbarBackground);

  // Only show overlay on toggle message
  browser.runtime.onMessage.addListener((msg) => {
    if (msg && msg.action === "toggleToolbar") {
      if (overlay.style.visibility === "hidden") {
        overlay.style.visibility = "visible";
        overlay.style.opacity = "1";
        setTimeout(() => {
          urlBar.blur();
          urlBar.focus();
          urlBar.setSelectionRange(urlBar.value.length, urlBar.value.length);
        }, 100);
      } else {
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
      }
    }
  });

  // Suggestion dropdown
  const suggestionBox = document.createElement("div");
  suggestionBox.style.position = "absolute";
  suggestionBox.style.left = "0";
  suggestionBox.style.top = "52px";
  suggestionBox.style.width = "100%";
  suggestionBox.style.background = "Field";
  suggestionBox.style.border = "1px solid ButtonBorder";
  suggestionBox.style.borderRadius = "0 0 8px 8px";
  suggestionBox.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
  suggestionBox.style.zIndex = "2147483648";
  suggestionBox.style.display = "none";
  suggestionBox.style.maxHeight = "260px";
  suggestionBox.style.overflowY = "auto";
  suggestionBox.style.color = "CanvasText";
  suggestionBox.style.colorScheme = "light dark";
  suggestionBox.style.fontSize = "1rem";
  suggestionBox.style.boxSizing = "border-box";
  suggestionBox.style.padding = "0";
  suggestionBox.tabIndex = -1;
  urlBarWrapper.style.position = "relative";
  urlBarWrapper.appendChild(suggestionBox);

  let suggestions = [];
  let selectedSuggestion = -1;

  async function getSuggestions(query) {
    if (!query) return [];
    // 1. Bookmarks
    const bookmarkResults = await browser.runtime.sendMessage({
      action: "searchBookmarks",
      query,
    });
    // 2. History
    const historyResults = await browser.runtime.sendMessage({
      action: "searchHistory",
      query,
    });
    // 3. Google search suggestions (fetched from background)
    let searchResults = [];
    try {
      searchResults = await browser.runtime.sendMessage({
        action: "getSearchSuggestions",
        query,
      });
      searchResults = (searchResults || []).map((s) => ({
        type: "search",
        value: s,
      }));
    } catch {}
    // Format bookmarks and history
    const bookmarkSuggestions = (bookmarkResults || []).map((b) => ({
      type: "bookmark",
      value: b.url,
      title: b.title,
    }));
    const historySuggestions = (historyResults || []).map((h) => ({
      type: "history",
      value: h.url,
      title: h.title,
    }));
    return [...bookmarkSuggestions, ...historySuggestions, ...searchResults];
  }

  function renderSuggestions(suggestions) {
    suggestionBox.innerHTML = "";
    if (!suggestions.length) {
      suggestionBox.style.display = "none";
      return;
    }
    suggestionBox.style.display = "block";
    suggestions.forEach((s, i) => {
      const item = document.createElement("div");
      item.style.padding = "8px 16px";
      item.style.cursor = "pointer";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.background = i === selectedSuggestion ? "Highlight" : "Field";
      item.style.color =
        i === selectedSuggestion ? "HighlightText" : "CanvasText";
      item.style.fontWeight = s.type === "bookmark" ? "bold" : "normal";
      if (s.type === "bookmark" || s.type === "history") {
        item.innerHTML = `<span style='flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'>${s.title || s.value}</span><span style='color:#888;font-size:0.9em;margin-left:8px;'>${s.value}</span>`;
      } else if (s.type === "search") {
        item.innerHTML = `<span style='flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'>🔍 ${s.value}</span>`;
      }
      item.onmousedown = (e) => {
        e.preventDefault();
        urlBar.value = s.value;
        suggestionBox.style.display = "none";
        urlBar.focus();
        urlBar.setSelectionRange(urlBar.value.length, urlBar.value.length);
      };
      suggestionBox.appendChild(item);
    });
  }

  let suggestionTimeout;
  urlBar.addEventListener("input", function () {
    clearTimeout(suggestionTimeout);
    const val = urlBar.value.trim();
    if (!val) {
      suggestionBox.style.display = "none";
      return;
    }
    suggestionTimeout = setTimeout(async () => {
      suggestions = await getSuggestions(val);
      selectedSuggestion = -1;
      renderSuggestions(suggestions);
    }, 120);
  });

  urlBar.addEventListener("keydown", function (e) {
    if (suggestionBox.style.display === "block") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedSuggestion = Math.min(
          selectedSuggestion + 1,
          suggestions.length - 1,
        );
        renderSuggestions(suggestions);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedSuggestion = Math.max(selectedSuggestion - 1, 0);
        renderSuggestions(suggestions);
      } else if (e.key === "Enter") {
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          urlBar.value = suggestions[selectedSuggestion].value;
          suggestionBox.style.display = "none";
        }
      } else if (e.key === "Escape") {
        suggestionBox.style.display = "none";
      }
    }
  });

  urlBar.addEventListener("blur", function () {
    setTimeout(() => (suggestionBox.style.display = "none"), 100);
  });

  // Initial load
  loadBookmarks();

  // Add to page
  overlay.appendChild(toolbar);
  document.body.appendChild(overlay);
})();
