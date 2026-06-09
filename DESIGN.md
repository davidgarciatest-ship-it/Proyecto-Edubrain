---
name: EduBrain Study Companion
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#454652'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#757684'
  outline-variant: '#c5c5d4'
  surface-tint: '#4355b9'
  primary: '#24389c'
  on-primary: '#ffffff'
  primary-container: '#3f51b5'
  on-primary-container: '#cacfff'
  inverse-primary: '#bac3ff'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#6c3400'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f4700'
  on-tertiary-container: '#ffc7a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00105c'
  on-primary-fixed-variant: '#293ca0'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is anchored in **Minimalism** with a focus on cognitive clarity, tailored for a teenage student demographic. It prioritizes a "focus-first" environment that reduces academic anxiety through generous white space and a calm, structured interface.

The aesthetic is modern and approachable, avoiding the coldness of traditional enterprise software. It achieves a friendly tone through soft geometry and intuitive navigation, making the AI assistant feel like a supportive peer rather than a rigid tool. Visual noise is strictly minimized to ensure that content—whether it's a study schedule or a nutritional tip—remains the hero of the experience.

## Colors

The palette is functional and purposeful, using color as a signifier for different cognitive states:

- **Indigo Blue (#3F51B5):** The primary color, reserved for "Focus Mode," study sessions, and academic tasks. It evokes depth and concentration.
- **Emerald Green (#2ECC71):** The secondary color, used for health, nutrition, and well-being features. It represents growth and vitality.
- **Light Gray (#F5F7FA) & White:** These form the foundation of the UI, providing a crisp, high-contrast background that ensures legibility.
- **Success & Alert:** While Emerald Green serves a dual purpose for health and success, a soft amber is recommended for low-priority warnings to maintain the calm atmosphere.

## Typography

The design system utilizes **Inter** exclusively to leverage its exceptional readability and modern, neutral character. 

- **Scale:** A tight typographic scale ensures hierarchy is clear without overwhelming the mobile screen. 
- **Weight:** Medium (500) and Semi-Bold (600) weights are used for semantic emphasis, while Bold (700) is reserved for major section headers.
- **Letter Spacing:** Headlines utilize slight negative tracking (-0.01em to -0.02em) to create a more cohesive, high-end editorial feel, while labels use positive tracking to ensure legibility at small sizes.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for mobile-first interaction. 

- **Grid System:** A 4-column grid for mobile with 16px gutters and 20px side margins. 
- **Spacing Rhythm:** Based on a 4px baseline shift. Most components should use 16px (md) for internal padding to maintain a spacious, breathable feel.
- **Safe Areas:** Strict adherence to mobile safe areas is required, ensuring that critical navigation and action buttons are always within the comfortable "thumb zone" (bottom 1/3 of the screen).

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layering** and **Subtle Elevation**.

- **Level 0 (Background):** #F5F7FA. The base canvas.
- **Level 1 (Cards/Surface):** #FFFFFF. Used for the primary content containers. These should have a very soft, high-blur shadow (0px 4px 20px rgba(0, 0, 0, 0.04)) to provide a "lifted" appearance without looking heavy.
- **Level 2 (Interactive):** Used for active states or floating action buttons. These may use a slightly more defined shadow tinted with the primary Indigo Blue to indicate interactivity.
- **Outlines:** Low-contrast 1px borders (#E2E8F0) are used for inactive inputs and secondary containers to maintain a clean, structured look.

## Shapes

The shape language is defined by a consistent **12px (0.75rem)** radius for all primary containers and cards.

- **Buttons:** Use a fully rounded (pill-shaped) style to maximize "tappability" and friendly aesthetic.
- **Cards & Modals:** Use the 12px standard.
- **Inputs:** Use an 8px radius to differentiate them slightly from structural cards while maintaining the soft visual theme.
- **Icons:** Use 2px stroke width outline icons with slightly rounded terminals to match the typography.

## Components

- **Buttons:** Primary buttons are Indigo Blue with white text. Secondary buttons for health features use Emerald Green. Ghost buttons (outline only) are used for tertiary actions.
- **Cards:** White surfaces with 12px rounded corners. Content within cards should follow the 16px padding rule.
- **Input Fields:** Light gray backgrounds (#F5F7FA) when inactive, transitioning to a 1px Indigo border when focused. Labels stay visible above the field.
- **Chips/Badges:** Small, rounded badges used for subject categories (e.g., "Math," "Biology") using soft tinted backgrounds (10% opacity of the category color) and full-strength text.
- **AI Chat Bubbles:** The AI response bubbles should use a very light Indigo tint to distinguish them from user messages, which remain White with a subtle border.
- **Progress Bars:** Thin, 6px tall bars with rounded caps. Use Emerald Green for completion to give a positive psychological reward.