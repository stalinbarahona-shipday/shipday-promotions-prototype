# Dispatch Settings — Full Architecture & Behavior Spec

## Context
This is the **Dispatch Settings** page inside Shipday's Settings section. It has two tabs: "Assignment Rules" and "Delivery Services". These are two independent but related systems.

---

## Page Structure

### Page Header
- Title: "Dispatch Settings"
- Subtitle: "Manage how orders are assigned to drivers and delivery services."
- Two tabs below: **Assignment Rules** (default active) | **Delivery Services**

---

## Tab 1: Assignment Rules

This tab contains ONE card: the **Auto-dispatch card**. Nothing else.

### Auto-dispatch Card — OFF State
When auto-dispatch has not been configured yet:

**Header section:**
- Title: "Auto-dispatch" with a gray badge "Off" next to it
- Subtitle: "Set how every new order gets matched to the best available driver automatically."
- Button (right-aligned): "Configure" (primary/green)

**Entry points grid (2x2 below header, separated by border-top):**
Each entry point is clickable and opens the full-view wizard.

| Entry Point | Icon | Description (off state) |
|---|---|---|
| Dispatch mode | `route` | In-house, third-party, or hybrid |
| Assignment rules | `tune` | Driver selection, timing, and limits |
| Third-party services | `delivery_dining` | Fees, tips, and service selection |
| Escalation rules | `timer` | Timeout before third-party fallback |

### Auto-dispatch Card — ACTIVE State
After user completes the wizard and activates:

**Header section:**
- Title: "Auto-dispatch" with a green badge "● Active"
- Subtitle: "Orders are being automatically assigned based on your configuration."
- Button (right-aligned): "Edit settings" (ghost/outlined)

**Entry points grid (2x2, same layout):**
Now each entry point shows a **summary of the configured value** instead of the generic description. Each is still clickable to open the wizard for editing.

| Entry Point | Icon | Summary example (active state) |
|---|---|---|
| Dispatch mode | `route` | "In-house only" or "In-house + Third-party" or "Third-party only" |
| Driver selection | `tune` | "Driver with the minimum number of orders" (reads from in-house config) |
| Third-party services | `delivery_dining` | "DoorDash, Uber" (list of active services) or "Not configured" |
| Escalation | `timer` | "5 min timeout" (hybrid only) or "Not applicable" |

**Dynamic behavior of entry points based on mode:**
- **In-house only**: Third-party shows "Not configured", Escalation shows "Not applicable"
- **Third-party only**: Driver selection shows "Not applicable", Escalation shows "Not applicable"
- **Hybrid**: All four show relevant configured values

---

## Tab 2: Delivery Services

This tab is **completely independent from auto-dispatch**. It's a catalog/directory of available delivery service providers. Users can activate services here for manual OR automatic use.

### Card: "Third party services available"
- Title: "Third party services available"
- Subtitle: "Expand your delivery capacity by activating third-party services."

**Sections with service rows:**

**On Demand:**
- DoorDash Drive — "On-demand delivery for short-distance orders" — Status badge (Active/Not active) — Chevron ›
- Uber Direct — "On-demand delivery for short-distance orders" — Status badge — Chevron ›

**Scheduled Catering:**
- DoorDash Catering — "Scheduled delivery for large catering orders" — Status badge — Chevron ›
- Dlivrd — "Scheduled delivery for catering and large orders" — Status badge — Chevron ›

**Clicking a service row:**
- If NOT active → Opens activation modal (terms & conditions, checkbox, activate button)
- If active → Opens deactivation flow (or toggles off directly)

### Card: "Invite Local delivery"
- Title: "Invite Local delivery"
- Subtitle: "Expand your delivery capacity by activating third-party services."
- Button (right-aligned): "+ Invite Local Company" (ghost)

---

## The Full-View Wizard

Opens when user clicks "Configure", "Edit settings", or any entry point in the auto-dispatch card. It takes over the entire viewport.

### Wizard Layout
- **Fixed header**: "Set up auto-dispatch" with X close button
- **Left sidebar**: 4-step vertical stepper (Setup label at top)
- **Main content area**: Scrollable, max-width ~640px
- **Fixed footer**: Back (left) | "X of Y" progress (center) | Continue (right)

### Sidebar Steps (always 4 visible)
1. **Choose mode** — icon: `route` — "In-house, third-party, or hybrid"
2. **Configure** — icon: `tune` — "Rules & settings"
3. **Custom Rules** — icon: `alt_route` — "Custom routing logic"
4. **Activate** — icon: `check_circle` — "Review & turn on"

### Step Sequences by Mode

**In-house only (4 screens):**
1. Choose mode → 2. In-house settings → 3. Custom rules → 4. Review & activate

**Third-party only (4 screens):**
1. Choose mode → 2. Third-party settings → 3. Custom rules → 4. Review & activate

**Hybrid (6 screens):**
1. Choose mode → 2. In-house settings → 3. Third-party settings → 4. Escalation/hybrid settings → 5. Custom rules → 6. Review & activate

All "configure" screens (steps 2-4 depending on mode) map to sidebar pill #2. Custom rules maps to pill #3. Review maps to pill #4.

---

## Step 1: Choose Mode

**Title**: "Choose your dispatch mode"
**Subtitle**: "This determines who handles your deliveries. You can change this anytime after setup."

Three mode cards stacked vertically, each with:
- Radio indicator (left) — filled green dot when selected
- Colored icon (mode-specific)
- Title + description

| Mode | Icon Color | Title | Description |
|---|---|---|---|
| In-house only | Green bg | In-house only | Assign orders to your own drivers based on proximity and availability. |
| Hybrid | Yellow/amber bg | In-house + Third-party | Try your drivers first, escalate to third-party if no one accepts. |
| Third-party only | Purple bg | Third-party only | Send all orders directly to your connected delivery services. |

### Expandable Service List
When the user selects **Hybrid** or **Third-party only**, the selected card EXPANDS (animated, max-height transition) to reveal a "Connected services" list inside the card. This list shows all available third-party services with:
- Service logo (small, 32px)
- Name + pricing subtitle
- Status badge (Active / Not active)
- "Activate" button (opens the TOS modal) or "Deactivate" button if already active

When the user selects **In-house only**, no expansion happens (no services needed).

**Important**: Clicking a service's Activate button opens the same Terms of Service modal used in the Delivery Services tab. The service toggle buttons use `event.stopPropagation()` so clicking them doesn't change the mode selection.

---

## Step 2b: In-house Driver Settings (shown for In-house and Hybrid modes)

**Title**: "In-house driver settings"
**Subtitle**: "Set settings for in-house drivers"

Settings displayed as **readable rows with edit icons** (like the existing third-party settings page in Shipday). Each row shows:
- Setting label (bold)
- Current value (gray text below)
- Edit pencil icon button (right side)

Clicking the edit icon expands an inline edit panel below the row. Selecting a value auto-closes the panel and updates the displayed value.

| Setting | Default Value | Edit Control |
|---|---|---|
| How to select drivers | "Driver with the minimum number of orders" | Dropdown (select) with options: Driver with minimum orders, Nearest to pickup, Same area (Basic), Same area (Smart batching), Broadcast nearest, Broadcast all |
| When to send the order | "When ready for pick up" | Segmented toggle: "As soon as it arrives" / "When ready for pick up" |
| Dispatch time window | "1.25 hours before delivery time" | Stepper input (±0.25 hours) |
| Max assigned orders per driver | "Consider drivers with less than or equal to 12 orders" | Stepper input (±1) |

---

## Step 2c: Third-party Driver Settings (shown for Third-party and Hybrid modes)

**Title**: "Third-party driver settings"
**Subtitle**: "Set settings for third-party drivers"

Same row + edit pattern as in-house settings.

| Setting | Default Value | Edit Control |
|---|---|---|
| How to select third-party drivers | "By earliest pickup" | Button group: "By earliest pickup" / "By lowest fee" / "Preferred service" |
| When to assign your orders | "5 minutes after the order comes" | Button group: "Immediately" / "5 min after order" / "Before pickup time" |
| Tip adjustments | "Driver will get 100% of the tips, $0 minimum" | Dropdown: 100% of tips, 50% of tips, No tip, Custom amount |
| Fee limits | "Do not use third party driver if fees exceed $15" | Number input for dollar amount |

---

## Step 2d: Hybrid-specific Settings (shown for Hybrid mode ONLY)

**Title**: "In-house driver settings"
**Subtitle**: "Additional settings for hybrid mode"

These are the extra settings needed when running both in-house and third-party.

| Setting | Default Value | Edit Control |
|---|---|---|
| Max assigned orders per driver (in-house) | "Consider drivers with less than or equal to 12 orders" | Stepper input (±1) |
| Send to 3rd party if no one accept within (min) | "Dispatch time: 5 mins" | Button group: "1 min" / "3 min" / "5 min" / "10 min" |

---

## Step: Custom Rules (shown for ALL modes)

**Title**: "Assignment rules"
**Subtitle**: "Set up rules to determine the best driver for each order based on your preferred criteria"

**Header row**: Title + subtitle on left, "+ Add a new rule" button on right

**Empty state**: Icon + "No rules yet." centered text

**Rule builder form** (appears when clicking "+ Add a new rule"):
- Rule name input
- Condition builder: "If [condition dropdown] is [operator dropdown] [value input]"
- Action: "Send to [vehicle type dropdown]"
- Conditions available: Order value, Delivery distance
- Operators: Greater than, Less than, Equal to
- Vehicle types: Car, Bicycle, Motorcycle, Walking, Scooter, E-Bike, Van, Pickup truck
- Cancel / Create rule buttons

**Created rules** display as cards:
- Rule name (bold)
- Condition text with highlighted values, e.g: "If Delivery distance is Less than 2 mile Send orders to In-house drivers"
- Edit, Delete, Drag handle buttons

---

## Step: Review & Activate (final step for ALL modes)

**Title**: "Review & activate"
**Subtitle**: "Confirm your settings. You can change anything after activation."

Displays styled review cards summarizing all configured settings:

1. **Mode card** — Shows selected mode name
2. **In-house settings card** (if applicable) — Shows driver selection, when to send, dispatch window, max orders in a 2-column key-value grid
3. **Third-party settings card** (if applicable) — Shows connected services, selection method, timing, tips, fee limits
4. **Escalation card** (hybrid only) — Shows timeout value inline in header
5. **Assignment rules card** (always) — Shows rule count or "None"

### Footer button on final step
Changes from ghost "Continue →" to primary green "Activate auto-dispatch ✓"

---

## State Management

### After wizard completion
When user clicks "Activate auto-dispatch" on the review step:
1. Wizard closes
2. Auto-dispatch card switches from OFF to ACTIVE state
3. Entry points update with configured value summaries
4. Service statuses sync between wizard and Delivery Services tab

### Key principle
- **Delivery Services tab** = "What providers do I have available?" (activate/deactivate services, manage catalog)
- **Assignment Rules tab** = "How are orders assigned?" (auto-dispatch configuration)
- A service can be active in Delivery Services but NOT used by auto-dispatch (user assigns manually)
- Auto-dispatch is optional — without it, all assignment is manual

---

## Service Activation Modal (shared between wizard and Delivery Services tab)

Appears when activating any third-party service. Must have z-index higher than the wizard overlay.

**Content:**
- Service logo + name + description
- Terms box with checkmarks: fees, data sharing, deactivation policy
- Checkbox: "I agree to the terms of service and privacy policy"
- Footer: Cancel (ghost) + Activate service (primary, disabled until checkbox checked)

After activation: service status updates everywhere (wizard inline list, Delivery Services tab, review screen).
