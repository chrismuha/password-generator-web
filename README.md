# Password Generator Web

The browser edition of the MCR Password Generator, published at <https://chrismuha.github.io/password-generator-web/>.

## Desktop and web editions

The desktop and web editions share the same Vue interface, password-generation logic, options, defaults, entropy calculation, secure randomness, history, symbol settings, and clipboard behavior.

| Area | Desktop edition | Web edition |
| --- | --- | --- |
| Runtime | Electron application | Web browser |
| Window | Fixed native application window | Responsive browser page |
| Distribution | macOS, Windows, and Linux packages | GitHub Pages website |
| Startup | Native startup screen | Browser page loading |
| Clipboard | Electron renderer clipboard access | Subject to browser clipboard permissions |
| Fonts | Operating-system desktop fonts | Can vary by browser and operating system |
| History | Temporary; resets when restarted | Temporary; resets when reloaded |

The actual password-generation algorithm is the same in both editions and uses `crypto.getRandomValues()` with rejection sampling.

## Desktop edition

Repository: <https://github.com/chrismuha/password-generator>

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

GitHub Pages deploys automatically from the `main` branch.
