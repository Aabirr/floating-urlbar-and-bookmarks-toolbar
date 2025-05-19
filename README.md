# Floating URlbar and Bookmark Toolbar Firefox Extension

This Firefox extension creates a modern, floating toolbar on web pages that provides quick access to your bookmark bar and a powerful URL/search bar.

## Features

- **Floating & Centered Toolbar:** Appears as a transparent, blurred overlay in the center of the screen.
- **Theme-Aware Design:** Adapts its appearance (colors, backgrounds) to your Firefox light or dark theme.
- **URL & Search Bar:** A dedicated input field to quickly navigate to URLs or perform searches using Google (or your default engine if configured by Firefox).
- **Smart Suggestions:** Provides suggestions from your browsing history, bookmarks, and Google search as you type.
- **Bookmark Grid:** Displays your Firefox bookmark bar items (bookmarks and folders) in a visually appealing grid.
- **Clickable Folders:** Navigate into your bookmark folders by clicking on them. Includes a "← Back" button to return to the previous folder.
- **Bookmark Icons:** Shows website favicons (if available) or a fallback with the first letter of the site/title.
- **Wrapped Text:** Long bookmark titles/URLs wrap within their icon box for better readability.
- **Keyboard Shortcut:** Toggle the toolbar's visibility instantly with a customizable keyboard shortcut (default is `Alt+Shift+B`).
- **Click Outside to Hide:** Easily dismiss the toolbar by clicking anywhere outside of it.
- **Focus on Open:** The URL bar is automatically focused and ready for typing when the toolbar appears.

## Limitations

- **Webpages Only:** Due to Firefox WebExtension limitations, the toolbar cannot be injected into privileged browser pages like `about:home`, `about:newtab`, `about:addons`, etc. It will only appear on regular websites (http/https).

## Installation

1.  Open Firefox and go to `about:debugging` in the address bar.
2.  Click "This Firefox" on the left sidebar.
3.  Click "Load Temporary Add-on..."
4.  Navigate to the extension directory on your computer and select the `manifest.json` file.
5.  The extension will now be loaded temporarily. It will be removed when you close Firefox.

## Usage

- Navigate to any regular website (e.g., google.com, wikipedia.org).
- Use the keyboard shortcut (`Alt+Shift+B` by default) to show or hide the floating toolbar.
- **URL/Search Bar:** Type in the bar to see suggestions. Press Enter or click "Go" to navigate or search.
- **Bookmarks:** Click on a bookmark icon to open the URL in a new tab.
- **Folders:** Click on a folder icon to view its contents. Use the "← Back" button to go up a level.
- **Hide:** Click anywhere outside the toolbar to hide it.

## Customizing the Keyboard Shortcut

If you want to change the default `Alt+Shift+B` shortcut:

1.  Open Firefox.
2.  Go to the Add-ons Manager (`about:addons`).
3.  Click "Extensions" on the left.
4.  Find "Floating Bookmark Toolbar".
5.  Click the gear icon (Settings) next to it.
6.  Select "Manage Extension Shortcuts".
7.  Click the current shortcut for "Toggle Floating Bookmark Toolbar" and press your desired key combination.

## Development

To modify the extension:

1.  Edit the files in the extension directory.
2.  Go to `about:debugging` in Firefox.
3.  Find the extension under "Temporary Extensions".
4.  Click "Reload" to apply your changes.

## Files

- `manifest.json`: Extension configuration and permissions.
- `content.js`: Injects and manages the floating toolbar UI and interactions on web pages.
- `background.js`: Handles browser API calls (bookmarks, history, tabs) and message passing with the content script, including keyboard shortcut handling.
- `styles.css`: (Note: Most styles are now inline in `content.js` for better control and theme-awareness, but this file could be used for additional global styles if needed.)
- `icons/`: Extension icons (currently uses a simple generated placeholder).
