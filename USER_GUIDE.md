# Password Generator Web User Guide

## Generate and copy

Choose **Password** under **What are you generating today?** to reveal the password settings. Adjust **Groups** and **Characters Per Group** to change the random-character count, then select **Generate Password**. Separators add characters between groups. Lowercase letters are always available. Uppercase, numbers, special characters, and exclusion of ambiguous characters are optional. Once a result appears, use **Copy to Clipboard** to place the current password on the clipboard; check the status if browser clipboard permission is denied.

## Generate a passphrase

Choose **Passphrase** under **What are you generating today?**. Select **Generate Passphrase** when you’re ready. The default is six random words joined by hyphens. Use **Word count** to choose 4 to 12 words and **Word separator** to choose Hyphen, Space, or Dot. Entropy is based on the size of the word list and how many words were chosen. Both formats use the same copy and history controls. Choose **Password** to return to the character password options. Switching types clears the displayed result.

The word list is adapted from the Electronic Frontier Foundation’s long word list, with four hyphenated entries omitted so a hyphen always marks a word boundary. [EFF word list](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Symbols and separators

Open Special Characters in Options to include or exclude individual symbols, Select All, or Select None. Turning special characters off excludes that pool. Separator choices are Dot, hyphen, Space, and None; None is the default. After you generate your first result, changing options regenerates the displayed result. Charset shows the available character count; entropy and its labels are estimates from length and charset, not a guarantee about an account or service.

## History and local persistence

History keeps at most ten entries. By default only copied passwords enter history; change the history-on-copy option to record generated passwords instead. Click a history entry to copy it again. Clear removes the displayed history. History is temporary unless you enable persistence in Options; persisted entries are stored in local browser/app-profile storage, not an encrypted password vault. Turning persistence off removes its stored copy. Keep passwords you need in your password manager.

## Feedback, keyboard, and editions

Copy feedback can be enabled and its duration adjusted from 1 to 30 seconds. Tab and Shift+Tab move between controls and wrap at the ends; Escape removes the current input focus. Desktop and web use the same generator. The browser edition depends on browser clipboard permissions and stores any persisted history for that website and browser profile. Desktop storage belongs to its app profile. They do not synchronize history across devices.

## Foldable preview profiles

In the development preview, choose a named device from Device:

| Device | Open (CSS pixels) | Closed (CSS pixels) |
| --- | --- | --- |
| iPhone Duo | 890 × 626 | 466 × 678 |
| Galaxy Z Flip8 | 360 × 840 | 349 × 316 (cover test) |
| Galaxy Z Fold7 | 750 × 832 | 412 × 960 |

Rotate swaps the selected width and height. These are display-sized CSS test presets; browser controls and display settings can change the usable page viewport. The iPhone Duo opens in landscape. Selecting a preset resizes the preview only; it does not rearrange application content.

Dimensions: [Apple iPhone Duo specifications](https://www.apple.com/iphone-duo/specs/) (display pixels divided by 3), [Galaxy Z Fold7 open measurement](https://www.effectiveviewport.com/devices/samsung-galaxy-z-fold7-unfolded/), and [Galaxy Z Fold7 closed measurement](https://www.effectiveviewport.com/devices/samsung-galaxy-z-fold7-folded/).

The Device list is alphabetical, with Current device first and Custom last. The Flip8 cover preset is a compact test approximation derived from Samsung’s display resolution at 3× density; usable cover-screen browser space can differ. [Samsung Galaxy Z Flip8 display specifications](https://www.samsung.com/sg/business/smartphones/galaxy-z/galaxy-z-flip8-cream-512gb-sm-f776bzwexsp/).

## Fixed issues and bug reports

Open Help below Options, then select Known issues to see documented problems and the Fixed section. Each completed fix can show its version, what happened, a **How we fixed it** explanation, and **What this means for you** notes. Only verified fixes belong here; an empty section means none are currently listed. Existing unresolved issues remain under Known issues.

Use the small **🐛 Bug Report** button at the bottom of the Help window from any section. It opens Report an issue inside the same window, where you can prepare an email draft, review it, and send it from your email app. It never sends a report automatically. Close or Escape returns to the program.
