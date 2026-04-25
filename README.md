# Битроид — IT Company Website

Static marketing website for **Bitroid**, an IT company specializing in web development, CRM integration, and SEO promotion.

## Project Structure

```
├── index.html                  # Entry point
├── content.html                # Main page content
├── components/
│   ├── header.html             # Header + mobile nav
│   └── footer.html             # Pre-footer CTA + footer
├── css/
│   ├── normalize.css           # CSS reset
│   └── main.css                # All styles (design tokens → components → responsive)
├── js/
│   └── main.js                 # Interactivity (burger, dropdowns, carousel, FAQ, etc.)
└── img/                        # All image assets
```

## How It Works

Components are loaded dynamically at runtime via `fetch()`. After all components are injected into the DOM, `main.js` is appended and initialized.

```js
await Promise.all([
  loadComponent('components/header.html', 'header-placeholder'),
  loadComponent('content.html', 'content-placeholder'),
  loadComponent('components/footer.html', 'footer-placeholder')
]);
```

## Running Locally

Requires a local HTTP server (plain `file://` won't work due to `fetch()`).

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| > 1300px | Desktop layout, full nav visible |
| ≤ 1300px | Mobile nav overlay enabled |
| ≤ 1200px | Burger menu shown, desktop nav hidden |
| ≤ 1024px | Banner and FAQ layout adjustments |
| ≤ 768px | Stacked banner, compact layout |
| ≤ 480px | Mobile-first layout, centered content |
| ≤ 320px | Small phone adjustments |

## JavaScript Features

- Burger menu toggle with body scroll lock
- Desktop dropdown menus (click-based)
- Mobile accordion navigation
- Infinite looping cases carousel (clone-based)
- FAQ accordion
- Who section mobile slider with dot navigation
- Custom checkbox toggle in contact form

## CSS Architecture

`main.css` is organized in order:

1. CSS custom properties (design tokens)
2. Base reset
3. Layout helpers / container
4. Components (header, banner, who, cases, FAQ, contact, footer)
5. Responsive overrides per component

Design baseline is **1440px** canvas width.
