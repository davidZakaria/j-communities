# J Communities — Community Cluster (form diagram)

**Home hero 3D structure** · Procedural WebGL geometry

---

## Concept

The home hero visualizes J Communities' brand soul: **living destinations** where architecture, community, and lifestyle come together. The 3D scene shows an interconnected neighborhood of residences — not abstract shapes or monumental architecture, but recognizable homes forming a community.

**Tagline:** "Building more than homes. Creating living experiences."

---

## Form Diagram

```
                    PLAN VIEW (looking down)
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │      ┌─────┐                    ┌──────┐       │
    │      │  4  │                    │  5   │       │
    │      │small│                    │small │       │
    │      └─────┘                    └──────┘       │
    │           ╲                    ╱               │
    │            ╲   ┌─────────┐   ╱                 │
    │  ┌──────┐   ╲  │ PLANTER │  ╱    ┌───────┐   │
    │  │  2   │────▶ │courtyard│ ◀────│   3   │   │
    │  │medium│      └─────────┘       │medium │   │
    │  └──────┘           │            └───────┘   │
    │       │             │                 │       │
    │       ▼             ▼                 ▼       │
    │    ═══════════ PATH ══════════════════       │
    │                     │                         │
    │              ┌──────────────┐                │
    │              │      1       │                │
    │              │  MAIN VILLA  │                │
    │              │  (tallest)   │                │
    │              └──────────────┘                │
    │                                              │
    │ ─ ─ ─ ─ ─ ─ SHARED PLINTH ─ ─ ─ ─ ─ ─ ─ ─ │
    └─────────────────────────────────────────────┘


                    ELEVATION VIEW (front)
    
              2           1            3
           ┌─────┐   ┌─────────┐   ┌──────┐
           │░░░░░│   │░░░░░░░░░│   │░░░░░░│
           │░░░░░│   │░░░░░░░░░│   │░░░░░░│
           │░░░░░│   │░░░░░░░░░│   │░░░░░░│
    ═══════╧═════╧═══╧═════════╧═══╧══════╧═══════
                 ELEVATED COURTYARD
    ──────────────────────────────────────────────
                   GROUND PLINTH
```

---

## Residence Configuration

| # | Name | Position | Height | Description |
|---|------|----------|--------|-------------|
| 1 | Main Villa | Center-front | 1.1 units | Largest residence, focal point |
| 2 | West Home | Left-center | 0.84 units | Medium villa, offset back |
| 3 | East Home | Right-center | 0.96 units | Medium villa, slight offset |
| 4 | Northwest Cottage | Back-left | 0.7 units | Smaller residence |
| 5 | Northeast Cottage | Back-right | 0.76 units | Smaller residence |

---

## Connecting Elements

### Walls
Low connecting walls (0.2 units high) link residences, suggesting:
- Shared property boundaries
- Community cohesion
- Not isolated boxes

### Paths
Ground-level paths (0.04 units raised) indicate:
- Walkable connections between homes
- Shared community circulation
- Neighborhood accessibility

### Planters
Central courtyard planter and accent planters suggest:
- Shared green space
- Community landscaping
- Living environment

---

## Materials (Monochrome Editorial)

| Element | Color | Roughness | Notes |
|---------|-------|-----------|-------|
| Concrete walls | `#3d3d3d` | 0.72 | Warm gray, premium feel |
| Roofs | `#1a1a1a` | 0.65 | Dark flat roofs |
| Windows | `#4a4a4a` | 0.30 | Soft glass with subtle emissive |
| Ground | `#252525` | 0.88 | Shared base plinth |
| Paths | `#333333` | 0.90 | Slightly elevated walkways |
| Planters | `#2d2d2d` | 0.75 | Courtyard features |

---

## Animation Behaviors

### Group Motion
- **Rotation:** Gentle continuous rotation (0.02 rad/s) + scroll-driven orbit
- **Elevation:** Sine-wave breathing (±0.015 units) + scroll parallax
- **Tilt:** Subtle tilt toward/away from viewer based on scroll

### Per-Residence Motion
- Individual breathing offsets (staggered timing)
- Scroll-driven elevation multipliers (back homes rise more)
- Scale breathing for organic feel

---

## Camera Journey

| Scroll | Position | View |
|--------|----------|------|
| 0% | `[4.5, 3.2, 5.5]` | Wide establishing shot, see full community |
| 50% | `[3, 2.4, 4]` | Mid approach, homes clearly readable |
| 100% | `[2, 1.8, 3]` | Close, intimate neighborhood feel |

---

## Success Criteria

At a glance, the hero 3D should read as:
- ✓ A **living community** of homes
- ✓ Recognizable as **residences** (not abstract shapes)
- ✓ **Connected** neighborhood (not isolated boxes)
- ✓ Premium **editorial** B&W aesthetic
- ✓ Matches brand: "Building more than homes"
