# CareConnect UI Design Guidelines

## Overview
CareConnect is an AI-powered home services platform for the Indian market. The UI should be **warm, welcoming, trustworthy, and visually vibrant** while maintaining excellent usability. The design should feel modern, premium, and distinctly Indian while being universally appealing.

---

## Design Philosophy

### Core Principles
1. **Warm & Welcoming**: Use colors that feel approachable and friendly
2. **Trustworthy**: Professional but not sterile or clinical
3. **Vibrant & Alive**: Bright, energetic colors that stand out
4. **Clean & Organized**: Plenty of white space, clear hierarchy
5. **Image-Rich**: Visual storytelling through high-quality photography
6. **Consistent**: Unified color and design language throughout

### Visual Mood
- **Primary Feeling**: Warm, energetic, premium, trustworthy
- **Secondary Feeling**: Modern, clean, organized, efficient
- **Avoid**: Clinical, sterile, corporate, cold, overly minimal

---

## Color Palette

### Primary Color: Coral Rose
A warm, vibrant coral that feels energetic and welcoming.

```css
--color-primary: #FF6B6B;
--color-primary-light: #FF8E8E;
--color-primary-dark: #E55A5A;
--color-primary-soft: #FFF0F0;
```

### Secondary Color: Teal Ocean
A calming teal that complements the coral and adds freshness.

```css
--color-secondary: #4ECDC4;
--color-secondary-light: #7EDDD6;
--color-secondary-dark: #3DB5AD;
--color-secondary-soft: #E8F8F7;
```

### Accent Color: Amber Gold
A warm gold for highlights, ratings, and premium elements.

```css
--color-accent: #FFB84D;
--color-accent-light: #FFD699;
--color-accent-dark: #E6A544;
--color-accent-soft: #FFF8E8;
```

### Neutral Colors

#### Backgrounds
```css
--color-background: #FFFFFF;
--color-surface: #FAFAFA;
--color-surface-muted: #F5F5F5;
--color-surface-alt: #EEEEEE;
```

#### Text
```css
--color-text-primary: #2D3436;
--color-text-secondary: #636E72;
--color-text-muted: #B2BEC3;
--color-text-disabled: #DFE6E9;
```

#### Borders & Dividers
```css
--color-border: #E0E0E0;
--color-border-subtle: #F0F0F0;
--color-border-light: #F5F5F5;
```

### Semantic Colors

#### Success
```css
--color-success: #00B894;
--color-success-light: #55EFC4;
--color-success-soft: #E6FFFA;
```

#### Warning
```css
--color-warning: #FFA502;
--color-warning-light: #FFD32A;
--color-warning-soft: #FFF8E1;
```

#### Error
```css
--color-error: #FF7675;
--color-error-light: #FFA8A8;
--color-error-soft: #FFE8E8;
```

#### Info
```css
--color-info: #74B9FF;
--color-info-light: #A0D2FF;
--color-info-soft: #E8F4FF;
```

---

## Typography

### Font Families

#### Headings
```css
--font-family-heading: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Body
```css
--font-family-body: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Monospace (for codes, IDs)
```css
--font-family-mono: 'Fira Code', 'Courier New', monospace;
```

### Font Sizes

```css
--font-size-display: 3.5rem;      /* 56px - Hero titles */
--font-size-h1: 2.5rem;            /* 40px - Page titles */
--font-size-h2: 2rem;              /* 32px - Section titles */
--font-size-h3: 1.5rem;            /* 24px - Subsection titles */
--font-size-h4: 1.25rem;           /* 20px - Card titles */
--font-size-body-lg: 1.125rem;     /* 18px - Large body text */
--font-size-body: 1rem;            /* 16px - Standard body text */
--font-size-body-sm: 0.875rem;     /* 14px - Small body text */
--font-size-caption: 0.75rem;      /* 12px - Captions, labels */
--font-size-tiny: 0.625rem;        /* 10px - Tiny text */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights

```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### Letter Spacing

```css
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.02em;
--letter-spacing-wider: 0.05em;
```

---

## Spacing System

### Base Unit
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Component Spacing

```css
--spacing-xs: var(--space-2);
--spacing-sm: var(--space-3);
--spacing-md: var(--space-4);
--spacing-lg: var(--space-6);
--spacing-xl: var(--space-8);
--spacing-2xl: var(--space-12);
--spacing-3xl: var(--space-16);
```

---

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Hero elements */
--radius-full: 9999px;  /* Pill shapes, circles */
```

---

## Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);

--shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-floating: 0 12px 32px rgba(0, 0, 0, 0.15);
```

---

## Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
--transition-slower: 500ms ease-in-out;
```

---

## Component Design Guidelines

### Buttons

#### Primary Button
- Background: `--color-primary`
- Text: White
- Border radius: `--radius-md`
- Padding: `--space-3 var(--space-6)`
- Hover: `--color-primary-dark`
- Active: `--color-primary-dark`
- Shadow: `--shadow-sm`
- Transition: `--transition-fast`

#### Secondary Button
- Background: `--color-surface`
- Text: `--color-primary`
- Border: 1px solid `--color-primary`
- Border radius: `--radius-md`
- Padding: `--space-3 var(--space-6)`
- Hover: `--color-primary-soft`
- Active: `--color-primary-soft`

#### Outline Button
- Background: Transparent
- Text: `--color-text-primary`
- Border: 1px solid `--color-border`
- Border radius: `--radius-md`
- Padding: `--space-3 var(--space-6)`
- Hover: `--color-surface-muted`

#### Ghost Button
- Background: Transparent
- Text: `--color-primary`
- Border: None
- Padding: `--space-3 var(--space-6)`
- Hover: `--color-primary-soft`

### Inputs & Form Elements

#### Text Input
- Background: `--color-background`
- Border: 1px solid `--color-border`
- Border radius: `--radius-md`
- Padding: `--space-3 var(--space-4)`
- Focus border: `--color-primary`
- Focus shadow: `0 0 0 3px var(--color-primary-soft)`
- Placeholder: `--color-text-muted`

#### Select Dropdown
- Background: `--color-background`
- Border: 1px solid `--color-border`
- Border radius: `--radius-md`
- Padding: `--space-3 var(--space-4)`
- Custom dropdown arrow in `--color-primary`
- Focus state same as text input

#### Checkbox
- Custom checkbox design
- Unchecked: Border `--color-border`, background `--color-background`
- Checked: Background `--color-primary`, white checkmark
- Border radius: `--radius-sm`
- Size: 20px

#### Radio Button
- Custom radio design
- Unchecked: Border `--color-border`, background `--color-background`
- Checked: Border `--color-primary`, center dot `--color-primary`
- Border radius: `--radius-full`
- Size: 20px

### Cards

#### Standard Card
- Background: `--color-background`
- Border: 1px solid `--color-border-subtle`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Shadow: `--shadow-sm`
- Hover: `--shadow-md`

#### Elevated Card
- Background: `--color-background`
- Border: None
- Border radius: `--radius-xl`
- Padding: `--space-8`
- Shadow: `--shadow-lg`
- Hover: `--shadow-xl`

#### Interactive Card
- Background: `--color-background`
- Border: 1px solid `--color-border-subtle`
- Border radius: `--radius-lg`
- Padding: `--space-6`
- Shadow: `--shadow-sm`
- Hover: `--shadow-lg`, transform translateY(-2px)
- Transition: `--transition-normal`

### Badges & Tags

#### Primary Badge
- Background: `--color-primary-soft`
- Text: `--color-primary`
- Border radius: `--radius-full`
- Padding: `--space-1 var(--space-3)`
- Font size: `--font-size-caption`

#### Success Badge
- Background: `--color-success-soft`
- Text: `--color-success`
- Border radius: `--radius-full`
- Padding: `--space-1 var(--space-3)`

#### Warning Badge
- Background: `--color-warning-soft`
- Text: `--color-warning`
- Border radius: `--radius-full`
- Padding: `--space-1 var(--space-3)`

#### Error Badge
- Background: `--color-error-soft`
- Text: `--color-error`
- Border radius: `--radius-full`
- Padding: `--space-1 var(--space-3)`

### Navigation

#### Sidebar
- Background: `--color-background`
- Border right: 1px solid `--color-border-subtle`
- Width: 280px
- Logo area: `--space-6` padding, `--color-primary` logo
- Nav items: 
  - Active: Background `--color-primary-soft`, text `--color-primary`
  - Hover: Background `--color-surface-muted`
  - Icon + text layout
  - Padding: `--space-3 var(--space-4`
  - Border radius: `--radius-md`

#### Topbar
- Background: `--color-background`
- Border bottom: 1px solid `--color-border-subtle`
- Height: 64px
- Logo: `--color-primary`
- User menu: Avatar + dropdown
- Notification bell: `--color-primary` with red badge for unread

#### Mobile Navigation
- Bottom tab bar for mobile
- 4-5 main tabs
- Active tab: `--color-primary`
- Floating action button for primary action

### Status Indicators

#### Status Badge
- PENDING: `--color-warning` background, dark text
- CONFIRMED: `--color-info` background, dark text
- IN_PROGRESS: `--color-primary` background, white text
- COMPLETED: `--color-success` background, white text
- CANCELLED: `--color-error` background, white text

#### Progress Steps
- Active step: `--color-primary` circle
- Completed step: `--color-success` circle with checkmark
- Pending step: `--color-border` circle
- Connecting line: `--color-border` (colored when completed)

---

## Layout Guidelines

### Container Widths

```css
--container-xs: 400px;
--container-sm: 600px;
--container-md: 800px;
--container-lg: 1000px;
--container-xl: 1200px;
--container-2xl: 1400px;
```

### Grid System

#### 12-Column Grid
```css
--grid-columns: 12;
--grid-gap: var(--space-6);
--grid-gap-sm: var(--space-4);
--grid-gap-lg: var(--space-8);
```

#### Responsive Breakpoints
```css
--breakpoint-xs: 480px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## Image Guidelines

### Image Sizes

```css
--image-avatar-xs: 32px;
--image-avatar-sm: 40px;
--image-avatar-md: 48px;
--image-avatar-lg: 64px;
--image-avatar-xl: 96px;

--image-thumbnail: 80px;
--image-card: 200px;
--image-feature: 400px;
--image-hero: 800px;
--image-full: 100%;
```

### Image Styles

#### Rounded Images
- Border radius: `--radius-lg` for cards
- Border radius: `--radius-full` for avatars

#### Image Overlays
- Gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`
- Text overlay: White text on dark overlay

#### Image Placeholders
- Use `--color-surface-muted` background
- Center icon in `--color-text-muted`
- Loading skeleton animation

---

## Icon Guidelines

### Icon Sizes

```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
--icon-2xl: 48px;
```

### Icon Colors

- Primary icons: `--color-primary`
- Secondary icons: `--color-text-secondary`
- Muted icons: `--color-text-muted`
- Success icons: `--color-success`
- Warning icons: `--color-warning`
- Error icons: `--color-error`

---

## Animation Guidelines

### Micro-Interactions

#### Button Hover
- Scale: 1.02
- Shadow increase
- Duration: `--transition-fast`

#### Card Hover
- Translate Y: -4px
- Shadow increase
- Duration: `--transition-normal`

#### Input Focus
- Border color transition
- Shadow appearance
- Duration: `--transition-fast`

### Loading States

#### Skeleton Loading
- Background: `--color-surface-muted`
- Animation: Shimmer effect
- Duration: 1.5s

#### Spinner
- Border: 3px solid `--color-border`
- Border-top: `--color-primary`
- Animation: Rotate
- Size: 24px

---

## Page-Specific Guidelines

### Homepage

#### Hero Section
- Full-width background image with overlay
- Large headline in `--color-primary`
- Subtitle in `--color-text-secondary`
- Primary CTA button
- Trust badges below

#### Service Categories
- Grid layout (3-4 columns)
- Category cards with images
- Hover effects
- Category icons in `--color-primary`

#### How It Works
- Step-by-step visual
- Numbered steps with `--color-primary` circles
- Connecting lines

#### Trust Indicators
- Statistics in large numbers
- Icons in `--color-secondary`
- Testimonials with avatars

### Dashboard

#### Overview Cards
- 4 key metrics
- Icon + value + label
- Color-coded by metric type
- Hover reveal details

#### Recent Activity
- Timeline layout
- Icon-based event types
- Time stamps
- Action buttons

### Service Request Form

#### Multi-Step Form
- Progress indicator at top
- Each step clearly labeled
- Current step highlighted in `--color-primary`
- Validation errors in `--color-error`

#### Form Fields
- Clear labels above inputs
- Helpful hints below inputs
- Inline validation
- Character counters for text fields

#### Image Upload
- Drag and drop zone
- Preview thumbnails
- Remove buttons
- Upload progress

### Booking Details

#### Status Timeline
- Horizontal timeline
- Current status highlighted
- Past steps completed
- Future steps grayed out

#### Provider Info
- Large avatar
- Name, rating, experience
- Skills tags
- Contact button

#### Scope of Work
- Card-style layout
- Checklist items
- Price breakdown
- Accept/Reject buttons

---

## Accessibility Guidelines

### Color Contrast
- WCAG AA compliance (4.5:1 for normal text)
- WCAG AAA compliance (7:1 for large text)
- Never rely on color alone for meaning

### Focus States
- All interactive elements must have visible focus states
- Focus ring: 2px solid `--color-primary`
- Focus offset: 2px

### Screen Readers
- Proper ARIA labels
- Semantic HTML
- Alt text for images
- Descriptive link text

### Keyboard Navigation
- All functionality accessible via keyboard
- Logical tab order
- Skip to main content link
- Visible focus indicators

---

## Responsive Design

### Mobile-First Approach
- Design for mobile first
- Progressively enhance for larger screens
- Touch-friendly tap targets (minimum 44px)

### Breakpoint Strategy
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Stacked layouts
- Larger touch targets
- Simplified navigation
- Condensed content

---

## Brand Assets

### Logo
- Primary color: `--color-primary`
- Secondary color: `--color-secondary`
- Minimum size: 120px width
- Clear on light and dark backgrounds

### Brand Colors Usage
- Primary: CTAs, important actions, brand elements
- Secondary: Supporting elements, accents
- Accent: Highlights, ratings, premium features
- Success: Positive feedback, completed states
- Warning: Caution, attention needed
- Error: Errors, destructive actions

---

## Implementation Notes

### CSS Custom Properties
All design tokens should be defined as CSS custom properties for easy theming and maintenance.

### Component Library
Build a consistent component library following these guidelines:
- Button variants (primary, secondary, outline, ghost)
- Input types (text, select, checkbox, radio)
- Card types (standard, elevated, interactive)
- Badge variants (color-coded)
- Status indicators
- Navigation components

### Design System Maintenance
- Document any deviations from these guidelines
- Update guidelines as the design evolves
- Keep components in sync with guidelines
- Regular design audits

---

## Image Requirements

### Suggested Image Categories

#### Service Category Images
- AC Repair
- Refrigerator Repair
- Plumbing
- Electrical
- Carpenter
- Painting
- Cleaning
- Appliance Repair

#### Hero Images
- Professional service technicians
- Happy customers
- Modern Indian homes
- Service scenarios

#### Trust & Safety Images
- Verified badges
- Insurance symbols
- Safety equipment
- Quality tools

#### Team Images
- Provider profiles
- Support team
- Office environment

### Image Specifications
- Format: WebP (preferred), JPEG (fallback)
- Quality: 80-90%
- Responsive: Multiple sizes for different breakpoints
- Alt text: Descriptive for accessibility
- Lazy loading: Implement for performance

---

## File Structure

### Image Directory
```
frontend/public/images/
├── hero/
│   ├── home-service-hero.jpg
│   ├── technician-working.jpg
│   └── happy-customer.jpg
├── categories/
│   ├── ac-repair.jpg
│   ├── refrigerator-repair.jpg
│   ├── plumbing.jpg
│   ├── electrical.jpg
│   ├── carpenter.jpg
│   ├── painting.jpg
│   ├── cleaning.jpg
│   └── appliance-repair.jpg
├── providers/
│   ├── technician-1.jpg
│   ├── technician-2.jpg
│   └── technician-3.jpg
├── trust/
│   ├── verified-badge.png
│   ├── insurance-icon.png
│   └── safety-icon.png
└── ui/
    ├── logo.svg
    ├── favicon.ico
    └── app-icon.png
```

---

## Next Steps

1. **Implement CSS Variables**: Add all design tokens to global CSS
2. **Update Component Library**: Rebuild components with new design system
3. **Replace Colors**: Update all existing color references
4. **Add Images**: Integrate new images throughout the application
5. **Test Responsiveness**: Ensure design works on all screen sizes
6. **Accessibility Audit**: Verify WCAG compliance
7. **Performance Optimization**: Optimize images and CSS

---

## Design Inspiration References

For visual inspiration (not to copy):
- Modern home service platforms
- Indian lifestyle apps
- Clean, vibrant SaaS interfaces
- Mobile-first consumer apps
- Warm, trustworthy healthcare apps

Focus on:
- Color psychology and warmth
- Image-heavy layouts
- Clean typography
- Intuitive navigation
- Trust-building elements

---

## Version History

- **v1.0** - Initial UI guidelines for CareConnect redesign
  - Coral Rose primary color
  - Teal Ocean secondary
  - Amber Gold accent
  - Light theme only
  - Image-rich design approach
  - Modern, warm, trustworthy aesthetic
