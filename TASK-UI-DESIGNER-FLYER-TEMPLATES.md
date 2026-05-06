# Task: Pixel-Perfect Flyer Templates — UI Designer

## Context

Shipday's Marketing Materials page lets restaurant owners create print-ready flyers to move customers from 3rd-party platforms (DoorDash, UberEats) to direct ordering. The page lives inside Dispatch Settings.

A working prototype already exists with all logic, interactions, and real QR codes. Your job is to make the 3 flyer templates visually world-class — the kind of quality a restaurant owner would be proud to print and put in customer bags.

---

## The 3 Templates

### 1. Store Menu Prices

**Purpose:** Rational argument. Restaurants raise prices 15-30% on 3rd-party apps to cover commissions. This flyer tells the customer: "you're overpaying on DoorDash — order direct and save $5-$15."

**Key message hierarchy:**
1. "Pay Our Store Menu Prices" (hero — biggest, boldest)
2. "Save $5-$15 vs. 3rd party ordering" (supporting proof)
3. Business identity (name, logo, rating, signature dish)
4. QR code to scan and order direct

**Where it's used:** Placed inside delivery bags from 3rd-party apps. Customer opens the bag, sees the flyer, next time orders direct.

**Design direction:** Should feel trustworthy and premium — not "coupon-y." The customer needs to believe this is a real business with real prices, not a gimmick.

---

### 2. % Off Discount

**Purpose:** Acquisition incentive. A classic "15% off your first direct order" to get customers to try ordering direct for the first time. Once they do and see better prices, they repeat.

**Key message hierarchy:**
1. The percentage number (hero — massive, unmissable: "15%")
2. "Off your next direct order"
3. "No code needed — discount auto-applies on scan"
4. Business identity (name, logo)
5. QR code

**Where it's used:** In bags, on the counter, shared on social media. Works as a first-purchase coupon.

**Design direction:** The number needs to dominate. Think billboard energy — someone glancing at this for 2 seconds should immediately understand "15% off, scan here." Clean, bold, no clutter.

---

### 3. Free Item or Delivery

**Purpose:** "Free" is psychologically more powerful than a percentage. "Free Garlic Knots with orders over $25" drives action better than "10% off." Also sets a minimum order to protect margin.

**Key message hierarchy:**
1. "Free [Item Name]" (hero — the free thing must be the star)
2. "With any order over $[amount]" (the condition)
3. Business identity (name, logo, rating, delivery areas)
4. QR code

**Where it's used:** Same as others — bags, in-store, social. Best for first-time conversion.

**Design direction:** Should feel generous and exciting. The free item is the hook. Consider how to make it feel like a gift, not a sales pitch.

---

## Design Requirements

### Print-first
- These get printed on Letter/A4 paper and placed in bags or posted on walls.
- Minimum body text: 10pt equivalent. Headlines: 24pt+.
- The QR code MUST be large enough to scan reliably from arm's length (~1.5 inches minimum printed size).
- High contrast between QR code and its background (dark modules on white background, inside a white container).
- Avoid fine details that disappear at 300dpi print.

### Visual hierarchy
- Someone glancing for 2 seconds should understand: (1) what the offer is, (2) how to get it (scan QR).
- The hero message takes 50%+ of visual weight.
- Business identity is secondary but must feel real and trustworthy (logo, name, Google rating).
- "Powered by Shipday" is a subtle footnote, never competing with the restaurant's brand.

### Color theming
- Each flyer supports 4 color themes: Shipday green, Red, Yellow, Slate.
- The user picks the theme in the editor. The flyer adapts.
- Design the templates so they work across all 4 themes — don't rely on a specific color for the layout to work.

### Thumbnail previews
- Each template also needs a thumbnail version that appears in the template picker.
- The thumbnail is cropped to show only the hero section (zoomed in, not the full flyer scaled down).
- At thumbnail size (~350px wide card), the main value proposition must be immediately recognizable.

### Export sizes
- Print: Letter / A4 proportions
- Social: 1080 x 1080 square crop (the flyer is cropped from top)

---

## What Already Exists (Prototype)

The working prototype is at:
```
/components/dispatch/MarketingMaterials.tsx
```

It includes:
- All 3 templates with live previews (400px wide)
- Thumbnail versions (260px wide, shown at scale 1.25 crop)
- Full-screen editor with fields, color theme picker, logo upload, export size toggle
- Real QR codes via `qrcode.react` (QRCodeSVG)
- Google Business search modal (fake UI) for auto-populating business data
- Dark mode support throughout
- Toast notifications, download flow (UI only)

### Inline styles
The project uses inline React styles (no Tailwind in flyer components). Your designs will be implemented as inline styles. Keep this in mind — avoid designs that require complex CSS features (pseudo-elements, complex gradients layering, etc.).

### Theme tokens available
```
t.accent      (#008062)
t.accentLight (#EBFEF6)
t.accentText  (#03624C)
t.bg, t.bgSecondary, t.bgTertiary
t.surface, t.surfaceHover
t.border, t.borderLight
t.text, t.textSecondary, t.textMuted
t.inputBg, t.overlayBg, t.cardShadow
```

---

## Deliverables

1. **3 flyer designs** — full-size (400px wide preview, representing Letter/A4 print)
2. **3 thumbnail crops** — the hero section of each, as it appears in the template picker cards
3. **Color theme variations** — show each template in at least Shipday green + one alternate theme
4. **Dark mode** — the flyer itself is always white/light (it's printed), but the surrounding UI (editor, cards) uses dark mode tokens

---

## Reference

Run the prototype locally to see the current state:
```bash
cd /Users/olivercambrano/Marketingmaterials
npm run dev
# Open http://localhost:3000 -> "Boost direct ordering" tab
```

The IA Receptionist project has a similar Google Business search pattern for reference:
```
/Users/olivercambrano/shipdayiareceptionist2/src/App.jsx
```
