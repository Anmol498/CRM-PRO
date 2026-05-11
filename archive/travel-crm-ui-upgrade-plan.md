# Travel CRM — Premium UI/UX Upgrade Plan
**Aesthetic Direction:** Linear-precision meets Stripe-polish — dark-first, data-dense, quietly alive.

---

## Guiding Principles

1. **Motion serves productivity.** Every animation must reduce cognitive load or confirm an action — never decorate for its own sake.
2. **Depth without noise.** Elevation, blur, and shadow create hierarchy. They don't compete with data.
3. **Tokens first, components second.** Every visual decision traces back to a design token. No magic numbers.
4. **Performance is non-negotiable.** Target Lighthouse 90+. Framer Motion loaded only where truly needed via dynamic imports.

---

## Aesthetic Direction

| Attribute | Decision |
|---|---|
| **Personality** | Precision tool. Calm authority. Zero fluff. |
| **Primary font** | `Geist` (Variable) — Vercel's workhorse, sharper than Inter, excellent at small data sizes |
| **Mono font** | `Geist Mono` — for IDs, booking refs, numbers in tables |
| **Color lead** | Dark mode primary. Light mode is an inversion, not a redesign. |
| **Motion style** | Ease-out, short durations (120–200ms), no spring bounce |
| **Depth language** | Subtle border + shadow stack, NOT heavy glassmorphism |
| **Accent strategy** | Brand red `#a33126` for destructive/primary actions. Brand blue `#4c86d1` for info/links. Neutral surfaces everywhere else. |

---

## Phase 1 — Foundations
> **Goal:** Every subsequent component change is consistent because the token system is solid.
> **Estimated effort:** 1 day

### 1.1 Typography

Install Geist via `fontsource` (zero render-blocking, tree-shakeable):

```bash
npm install @fontsource-variable/geist @fontsource-variable/geist-mono
```

In your root `main.tsx` / `index.css`:

```css
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';
```

### 1.2 Expanded Design Token System

Extend your Tailwind 4 `@theme` block in `globals.css`:

```css
@theme {
  /* ── Typography ── */
  --font-sans: 'Geist Variable', ui-sans-serif, system-ui;
  --font-mono: 'Geist Mono Variable', ui-monospace;

  /* ── Brand ── */
  --color-brand-red:       #a33126;
  --color-brand-red-dim:   #7a2520;
  --color-brand-red-glow:  rgba(163, 49, 38, 0.15);
  --color-brand-blue:      #4c86d1;
  --color-brand-blue-dim:  #3a6aaa;
  --color-brand-blue-glow: rgba(76, 134, 209, 0.15);

  /* ── Gradient ── */
  --gradient-brand: linear-gradient(135deg, #a33126 0%, #4c86d1 100%);
  --gradient-brand-subtle: linear-gradient(135deg, rgba(163,49,38,0.08) 0%, rgba(76,134,209,0.08) 100%);

  /* ── Elevation (Dark) ── */
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.4);
  --shadow-sm:  0 2px 6px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);

  /* ── Surface Stack (Dark) ── */
  --color-surface-0: #0a0a0b;   /* app bg */
  --color-surface-1: #111113;   /* sidebar */
  --color-surface-2: #18181b;   /* cards */
  --color-surface-3: #1f1f23;   /* inputs, table rows hover */
  --color-surface-4: #27272b;   /* active states */

  /* ── Border ── */
  --color-border:       rgba(255,255,255,0.07);
  --color-border-hover: rgba(255,255,255,0.12);
  --color-border-focus: rgba(76,134,209,0.5);

  /* ── Text ── */
  --color-text-primary:   rgba(255,255,255,0.92);
  --color-text-secondary: rgba(255,255,255,0.55);
  --color-text-muted:     rgba(255,255,255,0.3);

  /* ── Motion ── */
  --duration-instant: 80ms;
  --duration-fast:    150ms;
  --duration-normal:  220ms;
  --duration-slow:    350ms;
  --ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:   cubic-bezier(0.4, 0, 1, 1);
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Radius ── */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
}
```

### 1.3 Global Base Styles

```css
/* globals.css */
html {
  font-family: var(--font-sans);
  font-feature-settings: "cv02", "cv03", "cv04", "cv11"; /* Geist character variants */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Tabular numbers everywhere data lives */
.font-tabular { font-variant-numeric: tabular-nums; }

/* Subtle noise texture on app bg — adds premium depth */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise, see snippet below */
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border-hover); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
```

---

## Phase 2 — Core Layout (Sidebar & Topbar)
> **Goal:** The shell the user stares at all day becomes a premium frame.
> **Estimated effort:** 1 day

### 2.1 Sidebar Upgrades

**Visual changes:**
- Background: `surface-1` + `border-r border-[var(--color-border)]`
- Active nav item: left accent bar (3px, brand red), `surface-3` bg, full-width
- Hover: `surface-2` bg, `border-hover` border, `duration-fast` transition
- Icons: 18px, stroke-width 1.5 (not 2 — looks lighter, more premium)
- Logo zone: subtle brand gradient text or a single `#a33126` accent mark

**Animation — active item indicator:**
```tsx
// Use a layoutId for a sliding active pill (Framer Motion)
import { motion } from 'framer-motion';

{navItems.map(item => (
  <Link key={item.href} href={item.href}>
    {isActive && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute inset-0 bg-surface-3 rounded-md"
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    )}
    <span className="relative z-10">{item.label}</span>
  </Link>
))}
```

### 2.2 Topbar Upgrades

- Height: 48px (compact — Linear-style)
- Sticky with `backdrop-blur-md bg-surface-0/80` — frosted glass effect
- Right zone: avatar with online indicator dot, notification bell with badge
- Breadcrumb with `/` separators in `text-muted`
- Thin `border-b border-[var(--color-border)]`

### 2.3 Page Transitions

Install Framer Motion:

```bash
npm install framer-motion
```

Create `components/PageTransition.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

Wrap your `<Routes>` outlet with `<PageTransition>`.

---

## Phase 3 — Primary Components
> **Goal:** The components users touch 100× a day feel crafted.
> **Estimated effort:** 2–3 days

### 3.1 Buttons

Three tiers, all sharing base transition:

```css
.btn-base {
  transition: all var(--duration-fast) var(--ease-out);
  font-weight: 500;
  letter-spacing: -0.01em;
}
```

| Variant | Resting | Hover | Active |
|---|---|---|---|
| **Primary** | `bg-brand-red` | `bg-brand-red-dim + shadow-md` | `scale(0.98)` |
| **Secondary** | `bg-surface-3 border-border` | `bg-surface-4 border-border-hover` | `scale(0.98)` |
| **Ghost** | transparent | `bg-surface-2` | `scale(0.98)` |
| **Danger** | `bg-surface-3 text-red-400` | `bg-red-950 border-red-800` | `scale(0.98)` |

**Loading state — replace spinner with inline dots:**
```tsx
{loading && (
  <span className="flex gap-0.5">
    {[0,1,2].map(i => (
      <motion.span
        key={i}
        className="w-1 h-1 rounded-full bg-current"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </span>
)}
```

### 3.2 Forms & Inputs

**Input anatomy:**
```tsx
<div className="group relative">
  <label className="
    text-xs font-medium text-text-secondary
    transition-colors group-focus-within:text-brand-blue
  ">
    {label}
  </label>
  <input className="
    w-full bg-surface-2 border border-border rounded-md
    px-3 py-2 text-sm text-text-primary
    placeholder:text-text-muted
    transition-all duration-150
    hover:border-border-hover
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none
  " />
</div>
```

**Floating label variant** for prominent forms (login, booking creation):
- Label starts as placeholder, animates up on focus/filled
- Use CSS `peer` utilities in Tailwind or a small Framer Motion transform

### 3.3 Cards

```tsx
<div className="
  bg-surface-2 border border-border rounded-lg
  shadow-sm
  transition-all duration-150
  hover:border-border-hover hover:shadow-md hover:-translate-y-px
">
```

**Stat cards on Dashboard** — add a thin top-border gradient:
```css
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: var(--gradient-brand);
  opacity: 0.6;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
```

### 3.4 Tables & Data Grids

The bookings table is the primary work surface — this gets the most attention.

**Row design:**
```css
tr {
  border-bottom: 1px solid var(--color-border);
  transition: background var(--duration-instant) var(--ease-out);
}
tr:hover {
  background: var(--color-surface-3);
}
/* Selected row */
tr[data-selected] {
  background: var(--color-brand-blue-glow);
  border-color: var(--color-brand-blue);
}
```

**Entrance animation — staggered rows:**
```tsx
// Wrap tbody rows
{rows.map((row, i) => (
  <motion.tr
    key={row.id}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
  >
    ...
  </motion.tr>
))}
```
> Cap stagger at 15 rows (`delay: Math.min(i, 15) * 0.03`) to avoid feeling slow on large datasets.

**Status badges — replace plain text:**
```tsx
const statusConfig = {
  confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-950', dot: 'bg-emerald-400' },
  pending:   { color: 'text-amber-400',   bg: 'bg-amber-950',   dot: 'bg-amber-400'   },
  cancelled: { color: 'text-red-400',     bg: 'bg-red-950',     dot: 'bg-red-500'     },
};

<span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
  {status}
</span>
```

**Skeleton loading for table:**
```tsx
function TableSkeleton({ rows = 8 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {columns.map((_, j) => (
        <td key={j} className="px-4 py-3">
          <div
            className="h-4 rounded bg-surface-3 animate-pulse"
            style={{ width: `${60 + Math.random() * 30}%`, animationDelay: `${i * 50}ms` }}
          />
        </td>
      ))}
    </tr>
  ));
}
```

### 3.5 Modals & Drawers

**Modal entrance:**
```tsx
const modalVariants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  panel: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1,    y: 0 },
    exit:    { opacity: 0, scale: 0.98, y: 4 },
  },
};
// transition: duration 0.2, ease [0.16, 1, 0.3, 1]
```

**Drawer (slide-in from right) for Booking Details:**
```tsx
const drawerVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0,      opacity: 1 },
  exit:    { x: '100%', opacity: 0 },
};
// transition: duration 0.25, ease [0.16, 1, 0.3, 1]
```

Modal backdrop: `bg-black/60 backdrop-blur-sm`

### 3.6 Toasts / Notifications

Use `sonner` — the best-in-class toast library, designed for Radix/Tailwind stacks:

```bash
npm install sonner
```

```tsx
// main.tsx
import { Toaster } from 'sonner';
<Toaster
  position="bottom-right"
  toastOptions={{
    style: {
      background: 'var(--color-surface-3)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-sans)',
    },
  }}
/>
```

Call with: `toast.success('Booking confirmed')` / `toast.error(...)` / `toast.promise(...)`

---

## Phase 4 — Motion & Micro-interactions
> **Goal:** The interface feels alive without ever feeling slow.
> **Estimated effort:** 1–2 days

### 4.1 Animation Utility Hook

`hooks/useStaggeredEntrance.ts`:

```tsx
import { useEffect, useRef } from 'react';

export function useStaggeredEntrance(itemCount: number, baseDelay = 0.04) {
  return Array.from({ length: itemCount }, (_, i) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.22,
      delay: Math.min(i, 12) * baseDelay,
      ease: [0.16, 1, 0.3, 1],
    },
  }));
}
```

### 4.2 Dashboard Metric Cards — Number Counter

```tsx
import { useSpring, animated } from '@react-spring/web'; // or manual RAF

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { duration: 800, easing: t => 1 - Math.pow(1 - t, 3) },
  });
  return <animated.span>{spring.val.to(v => Math.floor(v).toLocaleString())}</animated.span>;
}
```

### 4.3 Auth Screen — Login Page

The login page is the first impression. Make it count:

- **Background:** Subtle animated gradient mesh (`@keyframes` shifting hue, 20s loop, very slow)
- **Card:** `shadow-xl`, thin brand-gradient top border, `backdrop-blur` if bg is complex
- **Input focus:** label floats up + blue ring + subtle card glow (`box-shadow: 0 0 0 1px var(--color-brand-blue)`)
- **Submit button:** Full-width, brand red, with the inline loading dots on submit

### 4.4 Empty States

Replace blank divs with intentional empty states:

```tsx
function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-3 border border-border flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-text-primary mb-1">{title}</p>
      <p className="text-xs text-text-muted mb-4 max-w-xs">{description}</p>
      {action}
    </motion.div>
  );
}
```

### 4.5 Micro-interaction Checklist

| Component | Interaction | Implementation |
|---|---|---|
| Sidebar nav item | Hover slide-in bg | CSS `transition` on `background-color` |
| Sidebar active | Animated pill | Framer `layoutId` |
| Button | Press scale | `active:scale-[0.98]` Tailwind |
| Button (loading) | Dots pulse | Framer `animate` opacity loop |
| Input | Label float | CSS `peer` + transform |
| Input focus | Blue glow ring | Tailwind `focus:ring-2 focus:ring-brand-blue/20` |
| Table row | Hover bg | CSS transition |
| Table rows | Entrance stagger | Framer stagger (capped at 15) |
| Card | Hover lift | `-translate-y-px shadow-md` |
| Modal | Scale-in | Framer scale + opacity |
| Drawer | Slide-in | Framer x transform |
| Toast | Slide up | Sonner built-in |
| Dashboard numbers | Count up | `@react-spring/web` |
| Page change | Fade+slide | Framer `AnimatePresence` |
| Status badge | Pulse dot (active) | CSS `animate-pulse` on dot only |

---

## Phase 5 — Charts & Data Visualizations
> **Estimated effort:** 0.5–1 day

If using Recharts (common with React 19):

- Replace default colors with `brand-red` and `brand-blue`
- Custom `<Tooltip>` styled with `surface-3 + border-border + shadow-lg`
- Animated chart entry: Recharts has `isAnimationActive` — keep it `true`, set `animationDuration={600}`
- Grid lines: `stroke={var(--color-border)}`, `strokeDasharray="4 4"`
- Axis text: `fill={var(--color-text-muted)}`, `fontFamily={var(--font-mono)}`

---

## Dependencies Summary

| Package | Purpose | Bundle impact |
|---|---|---|
| `framer-motion` | Page transitions, modals, stagger | ~45KB gzip (tree-shakeable) |
| `sonner` | Toast notifications | ~4KB |
| `@fontsource-variable/geist` | Typography | ~30KB (subset loaded) |
| `@fontsource-variable/geist-mono` | Monospace numbers | ~20KB |
| `@react-spring/web` | Number counters (optional) | ~25KB, only if needed |

> Framer Motion should be imported only in components that use it. Vite will tree-shake unused exports. Dynamic import page-level animation wrappers if Lighthouse score dips below 90.

---

## Implementation Order for AI Agent (Antigravity)

```
1. globals.css         → Token system, base styles, scrollbars
2. main.tsx            → Font imports, Toaster setup
3. PageTransition.tsx  → Route animation wrapper
4. Sidebar.tsx         → layoutId active pill, hover states
5. Topbar.tsx          → Compact height, blur, breadcrumb
6. Button.tsx          → All variants + loading state
7. Input.tsx           → Floating label, focus ring
8. Card.tsx            → Hover lift, stat card gradient border
9. DataTable.tsx       → Row hover, stagger entrance, skeletons, status badges
10. Modal.tsx           → Scale-in animation
11. Drawer.tsx          → Slide-in animation (Booking Details)
12. EmptyState.tsx      → Animated empty states
13. Dashboard page      → Animated metric numbers, staggered cards
14. Auth/Login page     → Premium first impression
15. Charts              → Styled Recharts components
```

---

## Performance Guardrails

- `will-change: transform` only on elements actively animating (add/remove with JS)
- All `@keyframes` use `transform` and `opacity` only — GPU composited, no layout reflow
- Stagger delays capped at row 15 (`Math.min(i, 15) * delay`)
- Framer Motion `LazyMotion` + `domAnimation` feature bundle for non-critical pages
- Disable animations when `prefers-reduced-motion: reduce` is set:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*End of plan. Every decision above traces back to the discovery answers: Linear precision, Stripe polish, productivity-first motion, and the brand's red-to-blue gradient as the single thread of identity.*
