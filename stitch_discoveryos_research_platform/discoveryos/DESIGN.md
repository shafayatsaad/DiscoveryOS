---
name: DiscoveryOS
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c0c6db'
  on-secondary: '#293040'
  secondary-container: '#404758'
  on-secondary-container: '#aeb5c9'
  tertiary: '#bec7db'
  on-tertiary: '#283140'
  tertiary-container: '#8891a4'
  on-tertiary-container: '#212a39'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#dae3f7'
  tertiary-fixed-dim: '#bec7db'
  on-tertiary-fixed: '#131c2a'
  on-tertiary-fixed-variant: '#3e4758'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  code-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin: 40px
---

## Brand & Style

The design system is engineered for high-stakes scientific computing and autonomous research. It balances the cold precision of laboratory equipment with the fluid usability of modern developer tools. The aesthetic is rooted in **Minimalism** and **Glassmorphism**, creating a "HUD" (Heads-Up Display) experience that feels both futuristic and professional.

The target audience consists of research scientists, AI engineers, and data analysts who require a distraction-free environment for complex orchestration. The UI evokes a sense of calm authority and limitless computational power. Every element is intentional, utilizing high-quality whitespace and subtle depth to organize dense information without visual clutter.

## Colors

The palette is strictly nocturnal, optimized for long-duration focus. The core background is a deep, obsidian navy (#0B0F14) which serves as the "void" upon which all glass layers sit. 

- **Primary Surface**: A semi-transparent layer used for main containers and sidebars, typically paired with a background blur.
- **Secondary Surface**: Used for nested elements, cards, or active states to provide subtle contrast against the primary surface.
- **Accent (Scientific Blue)**: Reserved for primary actions, progress indicators, and active selection states. It represents the "spark" of discovery.
- **Functional Colors**: Success, Warning, and Danger are utilized sparingly for status badges and system alerts, ensuring they command attention without overwhelming the monochromatic base.

## Typography

This design system employs a dual-font strategy. **Geist** is used for headlines, data points, and labels to lean into its technical, monospaced-adjacent heritage. **Inter** handles the heavy lifting for body text and UI controls to ensure maximum legibility and comfort.

- **Headlines**: Low letter-spacing and tight line-heights for a compact, editorial feel.
- **Labels**: Small caps or uppercase Geist are used for metadata, providing a "instrument panel" aesthetic.
- **Data Display**: Any numerical or scientific output should default to Geist to maintain vertical alignment and technical clarity.

## Layout & Spacing

The layout philosophy is **Desktop-First**, emphasizing a wide horizontal hierarchy that allows multiple data streams to be viewed simultaneously. 

A 12-column fluid grid is used for main content areas, with a max-width of 1440px to prevent excessive line lengths on ultra-wide monitors. Spacing follows a 4px linear scale. 

- **Sidebars**: Fixed at 280px or 320px depending on nesting depth.
- **Margins**: Generous 40px margins on desktop to allow the "glass" edges to breathe.
- **Grids**: Use 24px gutters to clearly separate complex data modules. 
- **Reflow**: On tablet, the layout transitions to a stacked single-column view for primary modules, with sidebars collapsing into a hidden drawer.

## Elevation & Depth

Depth is established through **Tonal Layering** and **Backdrop Blurs** rather than traditional heavy shadows.

1.  **Level 0 (Base)**: #0B0F14. The canvas.
2.  **Level 1 (Primary Surface)**: #111827 at 80% opacity with a 20px backdrop blur. Used for sidebars and main navigation.
3.  **Level 2 (Secondary Surface)**: #1A2332. Used for cards and modals.
4.  **Borders**: Instead of shadows, use 1px solid borders with low-opacity white (e.g., `rgba(255, 255, 255, 0.08)`) to define edges.

**Shadows**: When required for high-priority modals, use a very soft, large-radius "Ambient Shadow": `0 20px 50px rgba(0, 0, 0, 0.5)`.

## Shapes

The shape language is modern and approachable but retains a structural "click-into-place" feel.

- **Standard Radius**: 12px (rounded-md) for buttons and inputs.
- **Large Radius**: 16px (rounded-lg) for cards and main containers.
- **Extra Large**: 24px (rounded-xl) for global app wrappers or featured hero modules.

Avoid pill-shaped buttons except for specialized "Status" indicators; the 12px radius provides a more professional, "instrumental" appearance.

## Components

- **Buttons**:
    - **Primary**: Solid Accent Blue with white text. No gradient.
    - **Secondary**: Ghost style with 1px border `rgba(255,255,255,0.1)` and a subtle hover lift.
- **Inputs**: Darker than the surface background (#0B0F14) with a subtle 1px border. On focus, the border turns Accent Blue with a soft 2px outer glow.
- **Cards**: Secondary Surface color, 16px corner radius, and a subtle inner glow (top border lightened) to simulate a glass edge.
- **Chips/Badges**: Use the Label-MD typography style. Backgrounds should be low-opacity versions of the functional colors (e.g., Success at 10% opacity).
- **Lists**: Data-heavy lists should use Geist Mono-space for numbers. Row hover states should use a subtle highlight of `rgba(255, 255, 255, 0.03)`.
- **Modals**: High-blur background overlay (`backdrop-filter: blur(8px)`) with the card surface centered. No heavy entrance animations—use a simple 200px slide-up or fade.
- **No Chat Bubbles**: Communication should be handled via "Log entries" or "Command sequences" styled as code blocks or structured lists to maintain the OS feel.