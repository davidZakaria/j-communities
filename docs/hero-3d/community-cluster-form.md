# J Communities — Community Cluster (form diagram)

**Home hero 3D structure** · Procedural WebGL geometry · **Lifestyle Edition**

---

## Concept

The home hero visualizes J Communities' brand soul: **living destinations** where architecture, community, and lifestyle come together. The 3D scene shows an interconnected neighborhood of residences — not abstract shapes or monumental architecture, but recognizable homes forming a vibrant, lived-in community.

**Tagline:** "Building more than homes. Creating living experiences."

---

## Lifestyle Upgrade (v2)

This revision amplifies **all** aspects of the community feeling:

| Aspect | Before | After |
|--------|--------|-------|
| **Community** | Spread out | Tighter courtyard, stronger shared center |
| **Materials** | Cool gray concrete | Warm stone/wood tones |
| **Scale** | Tall (1.1 units) | Lower, residential (0.76 units max) |
| **Greenery** | 2 planters | 6 trees, 9+ shrubs, green edge border |
| **Paths** | Basic blocks | Clear ribbons + stepping stones |
| **Living cues** | Windows only | Pool, seating areas, terraces, warm glow |
| **Camera** | Distant | Closer, more intimate framing |

---

## Form Diagram

```
                    PLAN VIEW (looking down)
    ┌─────────────────────────────────────────────────┐
    │  🌳                                       🌳    │
    │      ┌─────┐      🌿        ┌──────┐           │
    │      │  4  │    ┌────┐      │  5   │           │
    │  🌿  │small│    │POOL│      │small │    🌿     │
    │      └─────┘    └────┘      └──────┘           │
    │  🌳      ╲   🌿    │    🌿  ╱         🌳       │
    │           ╲   ════════════  ╱                   │
    │  ┌──────┐  ╲  │ SEATING │  ╱   ┌───────┐       │
    │  │  2   │───▶ │courtyard│ ◀───│   3   │       │
    │  │medium│  🪨  └─────────┘  🪨  │medium │       │
    │  └──────┘           │          └───────┘       │
    │       │      ═══════════════       │           │
    │       ▼        MAIN PATH           ▼           │
    │            ┌──────────────┐                    │
    │     🪑     │      1       │      🪑            │
    │            │  MAIN VILLA  │                    │
    │            │  + TERRACE   │                    │
    │            └──────────────┘                    │
    │  🌿                                      🌿    │
    │ ════════════ GREEN EDGE ═════════════════     │
    └─────────────────────────────────────────────────┘

    Legend: 🌳 Tree  🌿 Shrub  🪑 Seating  🪨 Stone


                    ELEVATION VIEW (front)
    
          🌳    2         1          3      🌳
              ┌───┐   ┌───────┐   ┌────┐
              │▒▒▒│   │▒▒▒▒▒▒▒│   │▒▒▒▒│
              │▒▒▒│   │▒▒░░▒▒▒│   │▒▒░▒│  ← warm glow
              └───┘   └───────┘   └────┘
       ══════╧═══╧═════╧═══════╧═══╧════╧══════
                  TIGHTER COURTYARD
       ────────────────────────────────────────
              WARM GROUND PLINTH + GREEN EDGE
```

---

## Residence Configuration

| # | Name | Position | Height | Features |
|---|------|----------|--------|----------|
| 1 | Main Villa | Center-front | 0.76 units | Terrace, warm stone, wood trim |
| 2 | West Home | Left-center | 0.64 units | Terrace, alternating stone tone |
| 3 | East Home | Right-center | 0.70 units | Terrace, warm stone |
| 4 | Northwest Cottage | Back-left | 0.56 units | Compact, cozy |
| 5 | Northeast Cottage | Back-right | 0.60 units | Window glow |

**All residences now have:**
- Lower, more residential proportions
- Warm stone walls (alternating `#4a4540` / `#524a42`)
- Wood trim accents (`#3d3530`)
- Warm roof tones (`#2a2520` / `#352f28`)
- Glowing windows with warm emissive (`#6a5a4a`)

---

## Lifestyle Elements

### Greenery (15+ elements)

| Type | Count | Description |
|------|-------|-------------|
| Trees | 6 | Trunk + spherical canopy, varied heights |
| Shrubs | 9+ | Spherical foliage clusters |
| Green edge | 4 | Border strips around plinth |

**Foliage palette:** `#3d4a3a`, `#4a5a45`, `#2d3a2a` (muted greens)

### Water Feature

- Central pool (`#3a4a55`) with subtle glow
- Positioned as courtyard focal point
- Water emissive intensity: 0.12–0.27

### Outdoor Living

| Element | Count | Purpose |
|---------|-------|---------|
| Seating | 3 | Outdoor furniture clusters |
| Terraces | 3 | Rooftop/balcony extensions |
| Stepping stones | 6 | Informal path markers |

### Paths

- **Main ribbons:** Wide stone paths (`#5a544c`) connecting all homes
- **Stepping stones:** Organic placement (`#4d4840`)
- Clear visual hierarchy: front → courtyard → back homes

---

## Materials (Warm Editorial)

| Element | Color | Roughness | Character |
|---------|-------|-----------|-----------|
| Warm stone | `#4a4540` | 0.70 | Natural, residential |
| Stone alt | `#524a42` | 0.70 | Warmth variation |
| Wood trim | `#3d3530` | 0.60 | Organic accent |
| Warm roof | `#2a2520` | 0.60 | Dark but warm |
| Ground | `#3a3632` | 0.78 | Earth tone base |
| Courtyard | `#454038` | 0.75 | Warm paving |
| Path light | `#5a544c` | 0.80 | Stone walkways |
| Window glow | `#6a5a4a` | — | Warm interior light |
| Water | `#3a4a55` | 0.20 | Cool accent |
| Foliage | `#3d4a3a` | 0.85 | Muted green |

---

## Animation Behaviors

### Group Motion
- **Rotation:** 0.018 rad/s continuous + 0.55 scroll orbit
- **Breathing:** ±0.012 units subtle float
- **Tilt:** 0.035 max based on scroll

### Per-Residence Motion
- Staggered breathing (0.7s offset per home)
- 0.05× scroll elevation multipliers
- 0.006 scale breathing

---

## Camera Journey

| Scroll | Position | View |
|--------|----------|------|
| 0% | `[3.2, 2.4, 4.0]` | Intimate establishing shot |
| 50% | `[2.4, 1.8, 3.0]` | Mid approach, see courtyard life |
| 100% | `[1.8, 1.4, 2.4]` | Close, feel the community |

**Closer framing** throughout emphasizes the lived-in quality.

---

## Lighting

| Light | Position | Intensity | Color |
|-------|----------|-----------|-------|
| Key | `[0, 2, 0.2]` | 1.0–1.4 | `#f5e8d8` warm |
| Fill L | `[-1.2, 1.2, -0.3]` | 0.5–0.7 | `#e8dcd0` |
| Fill R | `[1.2, 1.2, -0.3]` | 0.5–0.7 | `#e8dcd0` |
| Courtyard | `[0, 0.5, -0.3]` | 0.3–0.45 | `#d4c8b8` ambient |

---

## Success Criteria

At a glance, the hero 3D should read as:

- ✓ A **vibrant, lived-in community** of homes
- ✓ **Warm and welcoming** (not cold/abstract)
- ✓ **Tighter courtyard** with clear shared center
- ✓ **Abundant greenery** — trees, shrubs, landscaping
- ✓ **Lifestyle cues** — pool, seating, terraces
- ✓ **Clear paths** connecting all homes
- ✓ **Lower, residential scale** — not monumental
- ✓ Matches brand: "Building more than homes. Creating living experiences."

---

## Changelog

### v2 — Lifestyle Edition
- Reduced all building heights (~30% lower)
- Tightened courtyard layout (closer homes)
- Added warm stone + wood materials
- Added 6 trees with trunk/canopy geometry
- Added 9+ shrub clusters
- Added green edge border around plinth
- Added central pool water feature
- Added 3 seating areas
- Added 3 rooftop terraces
- Added stepping stone paths
- Amplified window glow warmth
- Closer camera framing

### v1 — Initial Community Cluster
- 5 residences around shared courtyard
- Basic paths and planters
- Monochrome concrete materials
