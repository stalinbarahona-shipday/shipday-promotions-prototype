# Shipday Dispatch Settings — Variant B UX Specification

## Overview

Variant B is a redesigned dispatch settings experience that separates third-party delivery services into a dedicated page accessible via an expandable sidebar. It uses a card-based layout with structured configuration flows, full-screen setup overlays, and categorized service management.

---

## Page Structure

### Layout
- **Navbar** (68px fixed top): Company logo, nav tabs (Dispatch, Orders, Drivers, Routes, Reports, Integrations), notification bell, help icon, user avatar
- **Sidebar** (332px fixed left): Expandable grouped menu with "Settings" header
- **Main content** (flexible): Light gray background (#F8F8F5), centered content at max-width 980px

### Sidebar Navigation (Expandable Groups)
The sidebar uses collapsible groups. The "Dispatch" group expands to reveal two sub-items:
- **Dispatch settings** — main settings page
- **Third-party delivery** — dedicated services page

Active sub-item: white card with subtle shadow, green teal text (#03624C), font-weight 700.
Inactive: transparent background, gray text (#525252).

---

## Page 1: Dispatch Settings (activePage = "dispatch")

### Header
- Title: "Dispatch settings" (24px, font-[800])
- Subtitle: "Manage how orders are assigned to drivers and delivery services" (16px)

### Card 1: Dispatch Mode
- Horizontal row: ArrowLeftRight icon (44x44) + "Dispatch mode" title + mode description + colored status chip + chevron
- Chip colors by mode:
  - In-house: light blue bg (#EFF8FF), blue text (#175CD3)
  - Third-party: light purple bg (#F4F3FF), purple text (#6927DA)
  - Hybrid: light orange bg (#FFFAEB), orange text (#B54708)
- Click opens **Dispatch Mode Modal**

### Card 2: Order Assignment
- Multi-row card with rows that change based on current dispatch mode
- Each row: icon (40x40) + title + description + status chip + chevron

**In-house mode rows:**
1. "Assign orders to your drivers" — chip: "Manual" (gray) or "Automatic" (green)
2. "Custom rules" — chip: "No rules" / "X rules", disabled until auto-assign is on

**Hybrid mode:** adds a "third-party" row between the two above

**Third-party mode:** only third-party row + custom rules

- Click each row opens its respective **full-screen setup overlay**

---

## Page 2: Third-party Delivery (activePage = "services")

### Header
- Title: "Third-party delivery" (24px, font-[800])
- Subtitle varies by mode:
  - In-house: "Deliver more orders without hiring more drivers — connect a service and start today"
  - Third-party/Hybrid: "Manage your connected delivery services"

### Card 1: On Demand Delivery
White card with border, rounded-2xl.
- **Header**: "On Demand Delivery" (18px, font-[800]) + "Connect on-demand delivery services for short-distance orders" (15px, gray)
- **Provider rows:**
  - **DoorDash Drive** — "On-demand short distance food delivery, grocery, convenience, and other small retail deliveries" | Logo: red (#FF3008), letter "D"
  - **Uber Direct** — "On-demand short distance food delivery" | Logo: black (#000000), letter "U"

### Card 2: Scheduled Catering Delivery
Same card style as On Demand.
- **Header**: "Scheduled Catering Delivery" (18px, font-[800]) + "Connect catering delivery services for larger orders" (15px, gray)
- **Provider rows:**
  - **DoorDash Catering** — "Larger catering orders" | Logo: red (#FF3008), letter "D"
  - **Dlivrd** — "Larger catering orders" | Logo: purple (#6B21A8), letter "d"

### Card 3: Local Services (Invite Card)
Simpler card, single row.
- Plus icon (40x40) + "Invite a Local Delivery Partner" + "Add a local delivery company to your network"
- Button: "+ Invite Local Company" (white bg, teal text)

### Provider Row States

**Not connected:**
- Logo (40x40 with colored letter badge) + provider name (16px, font-[800]) + description (15px, gray)
- "Connect" button: white background, light border (#E8E8E4), teal text (#03624C)

**Connected:**
- Logo + provider name + changed subtitle: "You can assign orders manually to [Provider] drivers"
- "Connected" chip/pill: light green bg (#EBFEF6), teal text (#03624C), border-radius 100px, padding 7px 12px
- Chevron arrow (>) to open manage modal

---

## Modals & Overlays

### Provider Detail Modal (Connect Flow)
Triggered by clicking "Connect" on any provider row.
- Overlay: dark semi-transparent (#0A0A0A 50%)
- Modal: 636px wide x 630px tall, white, rounded-[20px]

**Sections:**
1. **Header** (108px): Logo (60x60) + provider name (24px) + subtitle + close button
2. **Content** (430px):
   - "How it works" — paragraph describing the service
   - "Pricing" — pricing model info
   - "Availability" — coverage info (red text if limited availability)
   - Checkbox: "I agree to share order details and customer information with [Provider]"
3. **Footer** (92px): "Cancel" button (white) + "Connect service" button (teal when checkbox checked, gray when unchecked)

**Available providers with details:**
- DoorDash Drive, Uber Direct, DoorDash Catering, Dlivrd (also Nash and Relay in data)

### Provider Manage Modal
Triggered by clicking the chevron arrow on a connected provider.
- Modal: 636px wide, white, rounded-[20px]

**Sections:**
1. **Header**: Logo (60x60) + provider name (24px) with "Connected" chip inline + subtitle + close button
2. **Stats row** (3 columns with borders):
   - Orders delivered (28px, font-[800])
   - Drivers used (28px, font-[800])
   - Avg. delivery time (28px, font-[800])
   - Gray labels below each stat (14px)
3. **Footer**: "Disconnect service" button (white bg, red text #D92D20) + "Done" button (teal bg, white text)

### Dispatch Mode Modal
Triggered by clicking the Dispatch Mode card.
- Modal: 746px wide x 562px tall

**Three selectable option cards:**
1. **In-house only** (Home icon) — "Use your own drivers to deliver orders"
2. **Third-party only** (Truck icon) — "Use third-party delivery services to deliver orders"
3. **In-house + third party** (ArrowLeftRight icon) — "Use a combination of in-house drivers and third-party services"

- Selected card: light green bg (#F6FEF9), green border (#01AD85), CircleCheck icon
- Unselected: white bg, gray border, Circle icon
- Footer: "Cancel" + "Save changes" (teal if changed)

---

## Full-Screen Setup Overlays

All three share the same layout pattern:
- Fixed full-screen, white background, z-index 2
- Header (116px): Title (24px) + subtitle + close button
- Content (scrollable, light bg): Centered at max-width 641px
- Footer (108px): "Cancel" + "Done" (teal if changed, gray if unchanged)

### 1. In-House Assignment Setup
Opened from "Assign orders to your drivers" row.

**Toggle card:** "Automatic assignment" with on/off switch

**When enabled, 3 config cards appear:**
- **Assignment method**: Dropdown — "Nearest available driver" (expandable for more options)
- **Driver capacity**: Stepper control (1-20 orders per driver)
- **Timing**: Segmented control — "Assign immediately" / "Assign before pickup"
  - If "before pickup": additional lead time stepper (5-120 minutes, step 5)

### 2. Third-Party Assignment Setup
Opened from "Assign orders to third-party" row.

**Toggle card:** "Automatic dispatch" with on/off switch

**When enabled, 4 config cards appear:**
- **Delivery services**: Provider rows with Connect/Connected actions (inline connect flow with detail modal)
- **Dispatch timing**: Segmented control — "Send immediately" / "Send on schedule" + priority dropdown (Lowest price / Fastest pickup / My preferred service)
- **Tip & fees**: Two side-by-side dropdowns — default driver tip (0-20%) + who pays delivery fee (business/customer/split)
- **Fallback**: Dropdown — "Notify me" / "Assign to my drivers" / "Hold the order"

### 3. Custom Rules Setup
Opened from "Custom rules" row.

**Rule list:** Each rule displayed as a card with natural language description:
> "If [field] is [operator] [value] send orders to [service]"

- Three-dot menu per rule: Edit / Delete
- "Add rule" button at bottom

**Rule editor (inline card):**
- Condition builder with inline dropdowns:
  - Field: order_value, distance, item_count, delivery_time
  - Operator: greater_than, less_than, equals
  - Value: numeric input
  - Service: doordash, uber, nash, relay, inhouse
- "Cancel" + "Save rule" buttons

---

## Toast Notifications
- Fixed top-center (96px from top)
- Dark background (#262626), rounded-xl, 338x48px
- Green CheckCircle icon + white message text
- Auto-dismisses after 3 seconds

**Messages:**
- "[Provider] connected successfully"
- "[Provider] disconnected"
- "Assignment settings saved"
- "Third-party dispatch settings saved"
- "Custom rules saved"

---

## Design Tokens Summary

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Brand green | #008062 | Primary buttons, active states |
| Brand green dark | #03624C | Text on green elements |
| Green tint | #EBFEF6 | Connected chip bg |
| Green surface | #F6FEF9 | Selected states |
| Page background | #F8F8F5 | Main content area |
| Card background | #FFFFFF | All cards |
| Text primary | #0A0A0A | Headings |
| Text secondary | #262626 | Sub-headings |
| Text tertiary | #404040 | Descriptions |
| Text muted | #737373 | Helper text, labels |
| Border | #E8E8E4 | Card borders, dividers |
| Error | #D92D20 | Disconnect, warnings |
| Disabled bg | #F4F4F8 | Inactive buttons |
| Disabled text | #A3A3A3 | Inactive button text |

### Typography
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page title | 24px | 800 | 140% |
| Card title | 18px | 800 | 140% |
| Row title | 16px | 800 | 140% |
| Body | 16px | 350-400 | 140-150% |
| Label | 15px | 350 | 140% |
| Button text | 14-16px | 500 | 19-22px |
| Chip text | 15px | 500 | 140% |
| Stat number | 28px | 800 | 130% |

### Spacing
| Context | Value |
|---------|-------|
| Page padding | 40px top, 64px sides |
| Card padding | 20-24px |
| Row padding | 16-24px |
| Section gap | 32px (gap-8) |
| Element gap | 12px |

### Radii
| Element | Value |
|---------|-------|
| Cards | 16px (rounded-2xl) |
| Buttons | 8px (rounded-lg) |
| Chips/pills | 100px (rounded-full) |
| Logos | 8px (rounded-lg) |
| Modals | 20px |

---

## Variant Selector
Fixed bottom-left corner. Three options: B, B1, B3. Dark background (#262626). This is a dev/demo tool, not part of the production UI.
