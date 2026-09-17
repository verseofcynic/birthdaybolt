# Kids Birthday Digital Invitation

A premium, playful, colorful children's birthday invitation website that works as a completely static site on GitHub Pages. No backend, no database, no build process.

All invitation content comes from a single configuration file: `data/invitation.json`. To create a new invitation for another child, you only edit that file and replace the photos/music.

---

## Project Structure

```
birthday-invitation/
├── index.html           ← page structure (no event-specific content)
├── style.css            ← theme, animations, responsive design
├── script.js            ← loads JSON, renders everything dynamically
├── .nojekyll            ← tells GitHub Pages to serve files as-is
├── data/
│   └── invitation.json  ← single source of truth for everything
├── assets/
│   ├── photos/          ← child photo, gallery images
│   ├── music/           ← background music file
│   └── icons/           ← favicon
└── README.md
```

No npm, no frameworks, no build step. Just HTML, CSS, vanilla JavaScript, and JSON.

---

## How to Edit the Birthday Information

Everything is in `data/invitation.json`. Here's what each section controls:

### Child Details

```json
"child": {
  "name": "Aarav",
  "nickname": "Aaru",
  "age": 5,
  "gender": "boy",
  "photo": "assets/photos/birthday-child.jpg"
}
```

- `name` — shown on the opening screen and hero section.
- `age` — displayed as "5th Birthday" automatically.
- `photo` — the child's photo shown in the hero. Use a relative path or a URL.

### Birthday Date & Time

```json
"birthday": {
  "date": "2026-10-18",
  "displayDate": "",
  "day": "",
  "time": "5:00 PM",
  "endTime": "8:00 PM",
  "timezone": "+05:30"
}
```

- If `displayDate` and `day` are left empty, the engine automatically derives the day name and formatted date from `date`.
- `timezone` is used for the countdown calculation so it's correct regardless of the visitor's location.
- To override the auto-derived date, set `displayDate` and `day` explicitly.

### Venue

```json
"venue": {
  "name": "Wonderland Kids Arena",
  "address": "123 Celebration Road, Trivandrum",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=...",
  "latitude": null,
  "longitude": null
}
```

- If `mapUrl` is empty, the "View Location" button is hidden but the address is still shown.

### Theme Colors

```json
"theme": {
  "primaryColor": "#7A3E9D",
  "secondaryColor": "#F7C948",
  "accentColor": "#FF6B81",
  "backgroundColor": "#FFF9F0",
  "surfaceColor": "#FFFFFF",
  "textColor": "#30243A",
  "mutedColor": "#756B7A"
}
```

All colors are applied as CSS variables. Change these to match any party theme — unicorn (pinks/purples), dinosaur (greens/browns), space (dark blue/silver), jungle (greens/yellows), rainbow (multi-color), superhero (red/blue), etc.

### Activities

```json
"activities": [
  { "icon": "🎈", "title": "Fun Games", "description": "Exciting games for everyone" },
  { "icon": "🎂", "title": "Birthday Cake", "description": "A special cake-cutting celebration" }
]
```

Activity cards are generated dynamically. Add or remove as many as you like. Use any emoji for the icon.

### Gallery

```json
"gallery": [
  { "image": "assets/photos/photo1.jpg", "caption": "Birthday memories" },
  { "image": "assets/photos/photo2.jpg", "caption": "Fun times" }
]
```

Add any number of photos. The gallery supports a lightbox with keyboard and touch navigation.

### RSVP

```json
"rsvp": {
  "enabled": true,
  "title": "Will You Join The Fun?",
  "buttonText": "RSVP on WhatsApp",
  "whatsappNumber": "919999999999",
  "message": "Hi! We would love to attend Aarav's 5th birthday celebration."
}
```

- Set `enabled` to `false` to hide the entire RSVP section.
- The WhatsApp button automatically constructs a `wa.me` link with the pre-filled message.

### Music

```json
"music": {
  "enabled": true,
  "file": "assets/music/birthday.mp3",
  "loop": true,
  "autoplay": false
}
```

- Music starts only after the user clicks "Open Invitation" (browsers block autoplay before user interaction).
- If the music file is missing, the music control is hidden and the invitation continues normally.

### Footer

```json
"footer": {
  "message": "Can't wait to celebrate with you!",
  "showMadeWith": false
}
```

Set `showMadeWith` to `true` to show "Made with love ❤️" at the bottom.

---

## How to Replace Photos

1. Put your photos in `assets/photos/`.
2. Reference them in `invitation.json` using relative paths:
   ```json
   "photo": "assets/photos/birthday-child.jpg"
   ```
3. You can also use external URLs (e.g., from Pexels) directly in the JSON.

For the favicon, set `invitation.favicon` to your icon path.

---

## How to Replace Music

1. Place your music file at `assets/music/birthday.mp3` (or update the path in `invitation.json`).
2. The floating music button appears in the bottom-left corner.
3. Click to play/pause. Music starts automatically when the invitation is opened.

---

## How to Change Colors

Edit the `theme` section in `invitation.json`. All six color values control different parts of the site:

| Color | Controls |
|---|---|
| `primaryColor` | Headings, buttons, countdown background |
| `secondaryColor` | Accents, badges, dividers |
| `accentColor` | Child's name, opening button gradient |
| `backgroundColor` | Page background |
| `surfaceColor` | Card backgrounds |
| `textColor` | Main text color |
| `mutedColor` | Secondary text |

---

## How to Configure WhatsApp RSVP

1. Set `rsvp.enabled` to `true`.
2. Enter the WhatsApp number in international format (no `+` or spaces): `"919999999999"`.
3. Write the pre-filled message in `rsvp.message`.
4. The button automatically opens WhatsApp with the message ready to send.

---

## How to Configure Google Maps

1. Set `venue.mapUrl` to a Google Maps URL.
2. To get a URL: go to [Google Maps](https://maps.google.com), search for the venue, click "Share", and copy the link.
3. If `mapUrl` is empty, the "View Location" button is hidden but the venue name and address are still shown.

---

## How to Deploy to GitHub Pages

1. Create a new repository on GitHub.
2. Upload all files to the repository.
3. Go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder.
5. Click **Save**.
6. Your invitation is live at `https://yourusername.github.io/repository-name/`.

The `.nojekyll` file ensures GitHub Pages serves all files as-is.

### Updating

```
Edit data/invitation.json
  ↓
Commit changes
  ↓
GitHub Pages automatically redeploys (within 1-2 minutes)
```

---

## How to Connect a Custom Domain

1. Go to **Settings → Pages → Custom domain**.
2. Enter your domain (e.g., `birthday.yourname.com`) and click **Save**.
3. Configure DNS with your domain provider:
   - For an apex domain: add an A record pointing to GitHub Pages IPs.
   - For a subdomain: add a CNAME record pointing to `yourusername.github.io`.
4. Check **Enforce HTTPS** once the domain is verified.

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

---

## Local Testing

Browsers block `fetch()` when opening `index.html` via `file://`. Use a simple local server:

**VS Code Live Server:** Right-click `index.html` → "Open with Live Server".

**Python:**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

On GitHub Pages, the site works directly with no server needed.

---

## Features

- Fully data-driven — all content from `invitation.json`
- Works for any child's birthday (boy or girl, any age)
- Opening screen with animated balloons and "Open Invitation" button
- Hero section with child photo, name, and age badge
- Countdown timer with timezone support
- Event details card with Google Maps link
- Dynamic activity cards from JSON
- Photo gallery with lightbox (keyboard + touch)
- WhatsApp RSVP with pre-filled message
- Background music with autoplay handling
- Confetti effect on invitation open and countdown completion
- Floating decorative emoji elements
- CSS balloon animations
- Configurable theme colors (unicorn, dinosaur, space, jungle, etc.)
- Mobile-first responsive design (320px to 1440px+)
- Accessibility: semantic HTML, ARIA labels, keyboard nav, reduced-motion support
- SEO and social sharing meta tags
- Lazy-loaded images
- Graceful error handling
- No build process, no frameworks, no dependencies
- GitHub Pages compatible with relative paths

---

## Creating a New Invitation

To reuse this website for another child's birthday:

1. Edit `data/invitation.json` — change the child's name, age, date, venue, theme colors, activities, gallery, RSVP, etc.
2. Replace photos in `assets/photos/`.
3. Replace music in `assets/music/`.
4. Upload to GitHub.

No need to edit `index.html`, `style.css`, or `script.js`.
