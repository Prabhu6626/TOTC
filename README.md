# TO Technologies — Website

A production-quality, multi-page static website for TO Technologies, an IT services and digital transformation company.

## 📁 File Structure

```
TO-Technologies/
├── index.html                 # Home page
├── about.html                 # About — mission, values, approach
├── services.html              # All 9 services overview
├── custom-applications.html   # Custom Applications (core offering)
├── industries.html            # 6 industry sectors with details
├── process.html               # 8-stage delivery process
├── managed-it.html            # Managed IT & Support
├── security.html              # Security & Reliability
├── engagement-models.html     # 6 engagement models
├── insights.html              # 4 articles / thought leadership
├── faq.html                   # 12 Q&As with accordion
├── contact.html               # Contact form + info
├── privacy.html               # Privacy Policy
├── terms.html                 # Terms of Service
├── 404.html                   # Custom 404 page
├── favicon.svg                # Brand SVG favicon
├── sitemap.xml                # XML sitemap for SEO
├── robots.txt                 # Search engine directives
├── README.md                  # This file
├── css/
│   └── style.css              # Complete design system + all styles
└── js/
    └── main.js                # All interactive JavaScript
```

## 🚀 Deploy for Free

### Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site" → "Deploy manually"**
3. Drag and drop the entire `TO-Technologies` folder
4. Your site is live! Set a custom domain in Site settings → Domain management
5. For the custom 404 page, Netlify will automatically use `404.html`

### Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Install the Vercel CLI: `npm i -g vercel`
3. In the project folder, run: `vercel --prod`
4. Or use the dashboard: **New Project → Import Git Repository**
5. Add a `vercel.json` for the 404 page:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/404.html" }]
}
```

### GitHub Pages
1. Create a GitHub repository and push all files
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → select `main` branch
4. Your site will be at `https://yourusername.github.io/repo-name/`
5. For custom 404, GitHub Pages automatically serves `404.html`

## ✏️ Placeholders to Replace

Before going live, search for and replace these placeholders throughout the HTML files:

| Placeholder | Replace With | Files |
|---|---|---|
| `[Legal Entity Name]` | Your registered company name | All footers, privacy.html, terms.html |
| `[Street Address, City, State ZIP]` | Your office address | Footers, contact.html, privacy.html, terms.html |
| `[email@example.com]` | Your contact email | All footers, contact.html, privacy.html, terms.html |
| `[+1 (000) 000-0000]` | Your phone number | All footers, contact.html, privacy.html, terms.html |
| `[Date]` | Current date | privacy.html, terms.html |
| `[Jurisdiction]` | Your legal jurisdiction | terms.html |
| `[Number]` | Registration/tax number | index.html footer |
| `[Client logo 1-5]` | Real client logos (with permission) | index.html trust strip |
| `[Testimonial]` | Real client testimonials | (Add when available) |
| `[Certification]` | Real certifications | (Add when available) |
| `YOUR_ACCESS_KEY_HERE` | Web3Forms access key | contact.html |
| `https://www.example.com` | Your actual domain | All pages (canonical, OG, sitemap, robots) |
| `info@example.com` | Your actual email | js/main.js (mailto fallback) |
| Social link `href="#"` | Real social media URLs | All footers |

### Contact Form Setup

The contact form uses **[Web3Forms](https://web3forms.com)**:

1. Go to [web3forms.com](https://web3forms.com)
2. Enter your email and get a free access key
3. Replace `YOUR_ACCESS_KEY_HERE` in `contact.html` with your key
4. Form submissions will be forwarded to your email

**Fallback:** If Web3Forms is unavailable, the form falls back to a `mailto:` link. Update the fallback email in `js/main.js` (search for `info@example.com`).

## 🎨 Design System

- **Font:** Inter (loaded from Google Fonts)
- **Colors:** Deep navy (#0A1628) text, electric blue (#2563EB) and teal (#0891B2) accents on white background
- **Design tokens:** All values in CSS custom properties in `css/style.css`
- **Responsive:** 360px to 1920px+ with fluid typography
- **Animations:** Scroll reveals, animated counters, gradient mesh, network canvas — all respect `prefers-reduced-motion`

## ♿ Accessibility

- Semantic HTML5 elements throughout
- ARIA labels and roles on all interactive elements
- Keyboard navigation support (focus-visible styles)
- Skip-to-content link on every page
- Alt text approach: decorative elements use `aria-hidden="true"`
- `prefers-reduced-motion` respected — all animations disabled when set

## 🔍 SEO

- Unique `<title>` and `<meta description>` on every page
- Open Graph meta tags for social sharing
- JSON-LD Organization schema on the home page
- Canonical URLs on every page
- XML sitemap (`sitemap.xml`)
- `robots.txt` with sitemap reference
- Semantic heading hierarchy (single `<h1>` per page)
- Breadcrumb navigation on interior pages

## ⚡ Performance

- No external images — all visuals are inline SVG, CSS gradients, or emoji
- Single CSS file (~1,500 lines, comprehensive design system)
- Single JS file (~300 lines, vanilla JavaScript)
- Google Fonts loaded with `display=swap`
- No frameworks, no build tools, no dependencies
- Animations use `requestAnimationFrame` and pause when tab is hidden

## 📝 Honesty Rules Applied

- No invented clients, testimonials, awards, or statistics
- No fake case studies — illustrative scenarios are clearly labeled
- Technology names appear only under "Technologies we work with"
- No implied partnerships or endorsements
- All placeholders are clearly marked with `[brackets]`
