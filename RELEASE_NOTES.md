# Password Generator Web — Release Notes

## September 2026 update

This update makes copying passwords clearer and gives you control over whether recent passwords remain available after refreshing or reopening the website.

### Clearer copy confirmation

- After a password is copied, **Copy to Clipboard** changes to a larger green **Copied** confirmation.
- The confirmation appears for five seconds by default.
- You can turn the confirmation off or adjust its duration from 1 to 30 seconds in **Options**.
- Copying an item from password history shows the same confirmation.

### Optional persistent history

- A new **Keep history after refresh** option can retain up to 10 recent passwords after a refresh or browser restart.
- This setting is off by default so passwords remain temporary unless you explicitly opt in.
- The preference and history are stored only in the browser's local storage for this website. They are not sent to a server or synced to the desktop edition.
- Turning the option off immediately removes the saved history. **Clear History** also removes saved entries.

### Web-specific behavior

- Retained history is separate for each browser, browser profile, device, and website origin.
- Private browsing, blocked site storage, clearing browsing data, or browser cleanup policies may erase retained history.

### Security note

Persistent history stores generated passwords as readable browser data. Leave the option off on shared or untrusted devices.
