# Dark Needle ✦ Tattoo Studio

A polished, premium single-page website for **Dark Needle Tattoo Studio** — a fictional high-end tattoo studio based in Los Angeles. Built with vanilla HTML, CSS, and JavaScript; no build step required.

---

## Features

| Section | Description |
|---|---|
| **Hero** | Full-viewport landing with animated particles and strong CTA |
| **Marquee** | Scrolling style-tag ticker |
| **Services** | Six service cards with pricing indicators |
| **Stats** | Animated counters (tattoos completed, artists, years, satisfaction) |
| **Gallery / Portfolio** | Filterable 4-column masonry-style grid |
| **Theme Toggle** | Switch between dark and light mode with saved preference |
| **Artists** | Single featured artist profile with specialty and social link |
| **About** | Studio story, pillars, and trust signals |
| **Location** | Dedicated studio location section with embedded map |
| **Testimonials** | Client reviews + press/media trust logos |
| **Contact / Booking** | Full booking form plus WhatsApp reservation CTA |
| **Footer** | Nav, address, email, legal links |
| **Localization** | Spanish-first copy with JavaScript-managed booking status messages |

### Design highlights
- Dark premium aesthetic with a gold accent palette
- Cinzel display font + Playfair Display italic accents + Inter body
- Scroll-triggered reveal animations (IntersectionObserver)
- Fully responsive (mobile nav, adaptive grids)
- Keyboard-accessible and focus-visible styles
- `prefers-reduced-motion` respected
- No external dependencies (fonts loaded from Google Fonts)

---

## Getting Started

Because the site is pure HTML/CSS/JS, you can open it in any modern browser with zero setup:

```bash
# Option 1 — open directly
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

For a live-reloading dev server (optional):

```bash
# Using Python (built-in)
python3 -m http.server 8080
# then visit http://localhost:8080

# Using Node.js (npx)
npx serve .
# then visit the URL printed in the terminal
```

---

## Project Structure

```
Dark-Needle/
├── index.html          ← Single-page application markup
├── css/
│   └── style.css       ← All styles (design tokens, layout, components)
├── js/
│   └── main.js         ← Interactions (nav, reveals, filters, form, counters)
└── README.md
```

---

## Customisation Guide

| What to change | Where |
|---|---|
| Studio name / tagline | `index.html` — hero section & `<title>` |
| Colours & fonts | `css/style.css` — `:root` custom properties at the top |
| Artist bio & photo | `index.html` — `#artists` section; edit `.artist-card__photo` |
| Gallery images | `index.html` — edit `.gallery__image` tags |
| Contact details | `index.html` — `#contact` section |
| Form action | `js/main.js` — replace the `setTimeout` mock with a real `fetch` call |

---

## License

All placeholder content (names, addresses, copy) is fictional and for demonstration purposes only.
