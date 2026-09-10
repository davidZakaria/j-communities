# Architectural Gateway — Geometry Specification

## Overview

The architectural gateway is a monumental portal structure designed to evoke **arrival, destination, and belonging** — the soul of J Communities' brand as a UK developer of premium real estate destinations in Egypt.

## Dimensions (Three.js units)

### Portal Pillars (×2)
- **Width:** 0.7
- **Depth:** 0.5  
- **Height:** 4.0
- **Spacing:** 3.2 (gateway span between inner pillar faces)

Each pillar features:
- Main mass in stone material
- Recessed panel detail on inner face (0.08 wide × pillar height - 0.6)
- Vertical metal accent strip (0.025 wide)
- Metal cap (pillar width + 0.1, height 0.16)
- Stone base detail (pillar width + 0.08, height 0.2)

### Horizontal Lintel / Canopy
- **Width:** gateway span + pillar width × 2 + 0.3 = ~4.9
- **Height:** 0.5
- **Depth:** 0.8

Features:
- Main lintel beam in stone
- Crown cap in metal (width + 0.2, height 0.12)
- Underside accent beam with subtle emissive
- Translucent glass canopy extension (0.04 thick, 0.5 deep overhang)

### Stepped Plinth Base (3 tiers)
Each tier is 0.25 units high (total 0.75):

| Tier | Width | Depth | Color |
|------|-------|-------|-------|
| 1 (bottom) | plinth + 0.8 | plinth + 0.8 | #252525 |
| 2 (middle) | plinth width | plinth + 0.3 | #2d2d2d |
| 3 (top) | plinth - 0.4 | plinth depth | #3a3a3a |

### Threshold Floor
- Paved area between pillars
- Center accent line (metal, 0.08 wide)

## Materials (Monochrome Editorial Palette)

| Element | Color | Roughness | Metalness | Notes |
|---------|-------|-----------|-----------|-------|
| Stone (main) | #2d2d2d | 0.75 | 0.06 | Pillars, lintel |
| Stone (light) | #3a3a3a | 0.78 | 0.05 | Top plinth, details |
| Stone (dark) | #252525 | 0.88 | 0.03 | Lower plinth |
| Metal | #4a4a4a | 0.35-0.4 | 0.55-0.65 | Caps, accents |
| Glass | #d8d8d8 | 0.12 | 0.08 | Canopy, 45% opacity |
| Ground | #1a1a1a | 0.95 | 0.02 | Dark editorial base |

## Animation

### Scroll-Driven Motion
- **Rotation:** 0 → 0.4 radians Y-axis (eased with `easeOutQuart`)
- **Float:** sinusoidal Y offset (amplitude 0.12)
- **Tilt:** subtle X-axis tilt based on scroll position (±0.04)
- **Breathing:** subtle sine wave (0.015 amplitude, 0.6 Hz)

### Camera Keyframes
| Scroll | Position | Target |
|--------|----------|--------|
| 0% | [5.5, 3.5, 7] | [0, 2.2, 0] |
| 50% | [3.5, 2.8, 5] | [0, 2.0, 0] |
| 100% | [2.0, 2.2, 3.5] | [0, 1.8, 0] |

## Visual Intent

The gateway should read instantly as **architecture you walk through into a destination**:

- Tall frames create vertical emphasis (aspiration)
- Passage between pillars invites entry (belonging)
- Stepped plinth elevates the threshold (ceremony, arrival)
- Monochrome palette sits naturally on B&W hero photo
- Premium materials suggest quality without ostentation

**Not:** a beach cabana, resort pergola, or decorative pavilion.
