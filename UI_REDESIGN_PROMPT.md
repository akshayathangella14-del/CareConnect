# CARECONNECT — COMPLETE UI REDESIGN IMPLEMENTATION

## OBJECTIVE

Completely redesign the CareConnect frontend UI with a beautiful, bright, vibrant color theme and modern, appealing design. The current blue theme feels clinical and hospital-like. The new design should be warm, welcoming, trustworthy, and visually striking while maintaining excellent usability.

---

## DESIGN SYSTEM IMPLEMENTATION

### 1. COLOR SYSTEM IMPLEMENTATION

#### Global CSS Variables
**File:** `frontend/src/styles/tokens.css`

Replace the entire color system with the new palette:

```css
:root {
  /* Primary Colors - Coral Rose */
  --color-primary: #FF6B6B;
  --color-primary-light: #FF8E8E;
  --color-primary-dark: #E55A5A;
  --color-primary-soft: #FFF0F0;
  --color-violet: #FF6B6B; /* Alias for compatibility */
  --color-violet-soft: #FFF0F0;
  --color-violet-100: #FFE8E8;

  /* Secondary Colors - Teal Ocean */
  --color-secondary: #4ECDC4;
  --color-secondary-light: #7EDDD6;
  --color-secondary-dark: #3DB5AD;
  --color-secondary-soft: #E8F8F7;

  /* Accent Colors - Amber Gold */
  --color-accent: #FFB84D;
  --color-accent-light: #FFD699;
  --color-accent-dark: #E6A544;
  --color-accent-soft: #FFF8E8;

  /* Backgrounds */
  --color-background: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-surface-muted: #F5F5F5;
  --color-surface-alt: #EEEEEE;

  /* Text Colors */
  --color-text-primary: #2D3436;
  --color-text-secondary: #636E72;
  --color-text-muted: #B2BEC3;
  --color-text-disabled: #DFE6E9;

  /* Border Colors */
  --color-border: #E0E0E0;
  --color-border-subtle: #F0F0F0;
  --color-border-light: #F5F5F5;

  /* Semantic Colors */
  --color-success: #00B894;
  --color-success-light: #55EFC4;
  --color-success-soft: #E6FFFA;

  --color-warning: #FFA502;
  --color-warning-light: #FFD32A;
  --color-warning-soft: #FFF8E1;

  --color-error: #FF7675;
  --color-error-light: #FFA8A8;
  --color-error-soft: #FFE8E8;

  --color-info: #74B9FF;
  --color-info-light: #A0D2FF;
  --color-info-soft: #E8F4FF;
}
```

### 2. TYPOGRAPHY SYSTEM

#### Font Integration
**File:** `frontend/index.html`

Add Google Fonts for Poppins and Inter:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

#### Typography Variables
**File:** `frontend/src/styles/tokens.css`

```css
:root {
  /* Font Families */
  --font-family-heading: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-body: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;

  /* Font Sizes */
  --font-size-display: 3.5rem;
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.5rem;
  --font-size-h4: 1.25rem;
  --font-size-body-lg: 1.125rem;
  --font-size-body: 1rem;
  --font-size-body-sm: 0.875rem;
  --font-size-caption: 0.75rem;
  --font-size-tiny: 0.625rem;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.02em;
  --letter-spacing-wider: 0.05em;
}
```

### 3. SPACING & LAYOUT SYSTEM

**File:** `frontend/src/styles/tokens.css`

```css
:root {
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);
  --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-floating: 0 12px 32px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  --transition-slower: 500ms ease-in-out;
}
```

---

## COMPONENT REDESIGN

### 4. BUTTON COMPONENT REDESIGN

**File:** `frontend/src/components/Button/Button.jsx` and `Button.module.css`

#### New Button Styles

```css
/* Primary Button */
.button--primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.button--primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button--primary:active {
  background-color: var(--color-primary-dark);
  transform: translateY(0);
}

/* Secondary Button */
.button--secondary {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
}

.button--secondary:hover {
  background-color: var(--color-primary-soft);
}

/* Outline Button */
.button--outline {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.button--outline:hover {
  background-color: var(--color-surface-muted);
  border-color: var(--color-primary);
}

/* Ghost Button */
.button--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border: none;
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.button--ghost:hover {
  background-color: var(--color-primary-soft);
}
```

### 5. INPUT COMPONENT REDESIGN

**File:** `frontend/src/components/Input/Input.jsx` and `Input.module.css`

#### New Input Styles

```css
.input {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-family-body);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.input::placeholder {
  color: var(--color-text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.input:disabled {
  background-color: var(--color-surface-muted);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.input--error {
  border-color: var(--color-error);
}

.input--error:focus {
  box-shadow: 0 0 0 3px var(--color-error-soft);
}
```

### 6. SELECT COMPONENT REDESIGN

**File:** `frontend/src/components/Select/Select.jsx` and `Select.module.css`

#### New Select Styles

```css
.select {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-family-body);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FF6B6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  background-size: 16px;
  padding-right: var(--space-10);
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}
```

### 7. CARD COMPONENT REDESIGN

**File:** `frontend/src/components/Card/Card.jsx` and `Card.module.css`

#### New Card Styles

```css
.card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card--elevated {
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
}

.card--interactive {
  cursor: pointer;
}

.card--interactive:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### 8. SIDEBAR REDESIGN

**File:** `frontend/src/layouts/AppShell/AppShell.jsx` and `AppShell.module.css`

#### New Sidebar Design

```css
.sidebar {
  background-color: var(--color-background);
  border-right: 1px solid var(--color-border-subtle);
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.sidebar__logo {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-subtle);
}

.sidebar__logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar__nav {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  margin-bottom: var(--space-1);
}

.sidebar__nav-item:hover {
  background-color: var(--color-surface-muted);
  color: var(--color-text-primary);
}

.sidebar__nav-item--active {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.sidebar__nav-item--active svg {
  color: var(--color-primary);
}

.sidebar__user {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}
```

---

## PAGE REDESIGN

### 9. HOMEPAGE REDESIGN

**File:** `frontend/src/pages/HomePage.jsx` and `HomePage.module.css`

#### New Homepage Design

```jsx
function HomePage() {
  return (
    <div className={styles.home}>
      {/* Hero Section with Image */}
      <section className={styles.home__hero}>
        <div className={styles['home__hero-content']}>
          <div className={styles['home__hero-badge']}>
            <Sparkles size={16} color="var(--color-primary)" />
            <span>Intelligent Home Services</span>
          </div>
          <h1 className={styles['home__hero-title']}>
            Expert care for your home, <span className={styles['home__hero-title-highlight']}>powered by AI</span>
          </h1>
          <p className={styles['home__hero-description']}>
            Tell us what needs fixing. Our AI analyzes your request, identifies required skills,
            and instantly matches you with background-verified professionals with transparent pricing.
          </p>
          <div className={styles['home__hero-actions']}>
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                Book a Service
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles['home__hero-image']}>
          <img 
            src="/images/hero/home-service-hero.jpg" 
            alt="Professional home service technician" 
            className={styles['home__hero-img']}
          />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className={styles.home__trust}>
        <div className={styles['home__trust-grid']}>
          <div className={styles['home__trust-item']}>
            <div className={styles['home__trust-icon']}>
              <ShieldCheck size={32} color="var(--color-secondary)" />
            </div>
            <div className={styles['home__trust-text']}>
              <div className={styles['home__trust-number']}>15L+</div>
              <div className={styles['home__trust-label']}>Happy Homes</div>
            </div>
          </div>
          <div className={styles['home__trust-item']}>
            <div className={styles['home__trust-icon']}>
              <Star size={32} color="var(--color-accent)" />
            </div>
            <div className={styles['home__trust-text']}>
              <div className={styles['home__trust-number']}>4.8★</div>
              <div className={styles['home__trust-label']}>Average Rating</div>
            </div>
          </div>
          <div className={styles['home__trust-item']}>
            <div className={styles['home__trust-icon']}>
              <Clock size={32} color="var(--color-primary)" />
            </div>
            <div className={styles['home__trust-text']}>
              <div className={styles['home__trust-number']}>30 min</div>
              <div className={styles['home__trust-label']}>Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories with Images */}
      <section className={styles.home__categories}>
        <div className={styles['home__section-header']}>
          <h2 className={styles['home__section-title']}>Popular Services</h2>
          <p className={styles['home__section-subtitle']}>Choose from our wide range of home services</p>
        </div>
        <div className={styles['home__category-grid']}>
          {categories.map(category => (
            <div key={category.id} className={styles['home__category-card']}>
              <div className={styles['home__category-image']}>
                <img src={category.image} alt={category.name} />
              </div>
              <div className={styles['home__category-content']}>
                <h3 className={styles['home__category-name']}>{category.name}</h3>
                <p className={styles['home__category-description']}>{category.description}</p>
                <Link to={`/service-requests/new?category=${category.id}`}>
                  <Button variant="ghost" size="sm">Book Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.home__how-it-works}>
        <div className={styles['home__section-header']}>
          <h2 className={styles['home__section-title']}>How It Works</h2>
          <p className={styles['home__section-subtitle']}>Simple steps to get your home serviced</p>
        </div>
        <div className={styles['home__steps']}>
          <div className={styles['home__step']}>
            <div className={styles['home__step-number']}>1</div>
            <div className={styles['home__step-content']}>
              <h3>Describe Your Problem</h3>
              <p>Tell us what needs fixing in plain language</p>
            </div>
          </div>
          <div className={styles['home__step']}>
            <div className={styles['home__step-number']}>2</div>
            <div className={styles['home__step-content']}>
              <h3>AI Analysis</h3>
              <p>Our AI understands and matches you with experts</p>
            </div>
          </div>
          <div className={styles['home__step']}>
            <div className={styles['home__step-number']}>3</div>
            <div className={styles['home__step-content']}>
              <h3>Get Quotes</h3>
              <p>Receive transparent quotes from verified professionals</p>
            </div>
          </div>
          <div className={styles['home__step']}>
            <div className={styles['home__step-number']}>4</div>
            <div className={styles['home__step-content']}>
              <h3>Book & Relax</h3>
              <p>Choose the best quote and get your home serviced</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

#### Homepage CSS

```css
.home__hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-16) var(--space-8);
  background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-background) 100%);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-12);
  align-items: center;
}

.home__hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.home__hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-background);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  width: fit-content;
}

.home__hero-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}

.home__hero-title-highlight {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.home__hero-description {
  font-size: var(--font-size-body-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  max-width: 500px;
}

.home__hero-image {
  position: relative;
}

.home__hero-img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
}

.home__trust {
  padding: var(--space-12);
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-12);
}

.home__trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.home__trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.home__trust-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.home__trust-number {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.home__trust-label {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.home__category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.home__category-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.home__category-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.home__category-image {
  height: 160px;
  overflow: hidden;
}

.home__category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.home__category-card:hover .home__category-image img {
  transform: scale(1.05);
}

.home__category-content {
  padding: var(--space-4);
}

.home__category-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.home__category-description {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-normal);
}
```

### 10. FORM REDESIGN

**File:** `frontend/src/pages/customer/CreateServiceRequestPage.jsx`

#### New Form Design

```jsx
<div className={styles['service-request-form']}>
  <div className={styles['form-header']}>
    <h1>Request a Service</h1>
    <p>Describe your problem and we'll match you with the right expert</p>
  </div>

  <form onSubmit={handleSubmit} className={styles['form-container']}>
    {/* Category Selection with Visual Cards */}
    <div className={styles['form-section']}>
      <label className={styles['form-label']}>
        <Wand2 size={18} color="var(--color-primary)" />
        Service Category
      </label>
      <div className={styles['category-grid']}>
        {categories.map(category => (
          <div 
            key={category._id}
            className={`${styles['category-card']} ${formData.category === category._id ? styles['category-card--selected'] : ''}`}
            onClick={() => setFormData({...formData, category: category._id})}
          >
            <div className={styles['category-card-icon']}>
              {getCategoryIcon(category.slug)}
            </div>
            <div className={styles['category-card-name']}>{category.name}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Description with Rich Text Feel */}
    <div className={styles['form-section']}>
      <label className={styles['form-label']}>
        <FileText size={18} color="var(--color-primary)" />
        Describe Your Problem
      </label>
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Tell us what's wrong. The more details you provide, the better we can help..."
        rows={6}
        className={styles['form-textarea']}
      />
      <div className={styles['form-hint']}>
        Include details like: when the problem started, what you've tried, and any specific symptoms
      </div>
    </div>

    {/* Image Upload with Drag & Drop */}
    <div className={styles['form-section']}>
      <label className={styles['form-label']}>
        <Camera size={18} color="var(--color-primary)" />
        Add Photos (Optional)
      </label>
      <div 
        className={styles['image-upload-zone']}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className={styles['upload-zone-content']}>
          <ImageIcon size={48} color="var(--color-text-muted)" />
          <p>Drag & drop images here or click to browse</p>
          <p className={styles['upload-zone-hint']}>Max 5MB per image • JPG, PNG</p>
        </div>
      </div>
      {imagePreviews.length > 0 && (
        <div className={styles['image-previews']}>
          {imagePreviews.map((preview, index) => (
            <div key={index} className={styles['image-preview']}>
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button 
                type="button"
                className={styles['image-remove']}
                onClick={() => removeImage(index)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Location with Map Feel */}
    <div className={styles['form-section']}>
      <label className={styles['form-label']}>
        <MapPin size={18} color="var(--color-primary)" />
        Service Location
      </label>
      <div className={styles['location-inputs']}>
        <Input
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="House/Flat No., Building"
          label="Address Line"
        />
        <div className={styles['location-row']}>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            label="City"
          />
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            label="State"
          />
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="PIN Code"
            label="PIN Code"
          />
        </div>
      </div>
    </div>

    {/* Schedule with Visual Calendar */}
    <div className={styles['form-section']}>
      <label className={styles['form-label']}>
        <CalendarClock size={18} color="var(--color-primary)" />
        Preferred Schedule
      </label>
      <div className={styles['schedule-inputs']}>
        <div className={styles['schedule-row']}>
          <Input
            name="preferredStartDate"
            type="date"
            value={formData.preferredStartDate}
            onChange={handleChange}
            label="Start Date"
          />
          <Input
            name="preferredStartTime"
            type="time"
            value={formData.preferredStartTime}
            onChange={handleChange}
            label="Start Time"
          />
        </div>
        <div className={styles['schedule-row']}>
          <Input
            name="preferredEndDate"
            type="date"
            value={formData.preferredEndDate}
            onChange={handleChange}
            label="End Date"
          />
          <Input
            name="preferredEndTime"
            type="time"
            value={formData.preferredEndTime}
            onChange={handleChange}
            label="End Time"
          />
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <div className={styles['form-actions']}>
      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        loading={isLoading}
        rightIcon={<Sparkles size={18} />}
      >
        Analyze & Match with Experts
      </Button>
    </div>
  </form>
</div>
```

#### Form CSS

```css
.service-request-form {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8);
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-header h1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-header p {
  font-size: var(--font-size-body-lg);
  color: var(--color-text-secondary);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.category-card {
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-card:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.category-card--selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.category-card-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card-name {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-textarea {
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-family: var(--font-family-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-relaxed);
}

.form-hint {
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.image-upload-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.image-upload-zone:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.upload-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.upload-zone-content p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

.upload-zone-hint {
  font-size: var(--font-size-caption);
  color: var(--color-text-muted);
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-error);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.image-remove:hover {
  background-color: var(--color-error-dark);
}

.location-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.location-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-4);
}

.schedule-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.schedule-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
}
```

---

## IMAGE INTEGRATION

### 11. IMAGE DIRECTORY SETUP

**Create:** `frontend/public/images/` directory structure

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
└── ui/
    ├── logo.svg
    └── favicon.ico
```

### 12. IMAGE USAGE GUIDELINES

#### Hero Images
- Dimensions: 1200x800px
- Format: WebP (with JPEG fallback)
- Style: Professional, warm, Indian context
- Content: Technicians, happy customers, modern homes

#### Category Images
- Dimensions: 400x300px
- Format: WebP (with JPEG fallback)
- Style: Clean, relevant to category
- Content: Service-specific imagery

#### Provider Images
- Dimensions: 200x200px (avatars)
- Format: WebP (with JPEG fallback)
- Style: Professional headshots
- Content: Providers in uniform

---

## RESPONSIVE DESIGN

### 13. MOBILE OPTIMIZATION

#### Mobile Navigation
- Bottom tab bar for primary navigation
- Hamburger menu for secondary navigation
- Touch-friendly targets (minimum 44px)

#### Mobile Layouts
- Single column grids
- Stacked card layouts
- Simplified forms
- Condensed content

#### Mobile Images
- Responsive image sizes
- Lazy loading
- Optimized formats

---

## ACCESSIBILITY IMPROVEMENTS

### 14. ACCESSIBILITY ENHANCEMENTS

#### Color Contrast
- Ensure all text meets WCAG AA standards
- Test color combinations with contrast checker
- Provide alternative indicators for color-coded information

#### Focus States
- Visible focus rings on all interactive elements
- Focus indicator: 2px solid var(--color-primary)
- Logical tab order

#### Screen Reader Support
- ARIA labels for custom components
- Semantic HTML structure
- Alt text for all images
- Descriptive link text

---

## IMPLEMENTATION PRIORITY

### Phase 1: Foundation (High Priority)
1. ✅ Update CSS variables in tokens.css
2. ✅ Update typography system
3. ✅ Redesign Button component
4. ✅ Redesign Input component
5. ✅ Redesign Select component
6. ✅ Redesign Card component

### Phase 2: Layout & Navigation (High Priority)
7. ✅ Redesign Sidebar
8. ✅ Redesign Topbar
9. ✅ Update mobile navigation
10. ✅ Implement responsive grid system

### Phase 3: Page Redesigns (Medium Priority)
11. ✅ Redesign Homepage
12. ✅ Redesign Service Request Form
13. ✅ Redesign Dashboard
14. ✅ Redesign Bookings page
15. ✅ Redesign Invoices page

### Phase 4: Polish & Details (Medium Priority)
16. ✅ Add images throughout
17. ✅ Implement loading states
18. ✅ Add micro-interactions
19. ✅ Optimize animations
20. ✅ Test responsive design

### Phase 5: Accessibility & Performance (Low Priority)
21. ✅ Accessibility audit
22. ✅ Performance optimization
23. ✅ Image optimization
24. ✅ Cross-browser testing
25. ✅ Final polish

---

## SUCCESS CRITERIA

### Visual Design
- [ ] Color theme is warm, vibrant, and cohesive
- [ ] Typography is modern and readable
- [ ] Spacing is consistent and generous
- [ ] Components have proper visual hierarchy
- [ ] Images are integrated throughout

### User Experience
- [ ] Navigation is intuitive and consistent
- [ ] Forms are visually appealing and easy to use
- [ ] Loading states are clear and engaging
- [ ] Error states are helpful and not intimidating
- [ ] Success states are celebratory

### Technical Quality
- [ ] Design system is consistent
- [ ] Components are reusable
- [ ] Code is maintainable
- [ ] Performance is optimized
- [ ] Accessibility standards are met

### Responsive Design
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (640px+)
- [ ] Works on desktop (1024px+)
- [ ] Touch targets are appropriate
- [ ] Images are responsive

---

## IMPORTANT NOTES

1. **DO NOT change functionality** - Only update the visual design
2. **DO NOT modify backend** - This is frontend-only
3. **DO NOT break existing features** - Test thoroughly after changes
4. **USE the new color palette consistently** - No random colors
5. **MAINTAIN accessibility** - Design for all users
6. **OPTIMIZE performance** - Large images can slow down the app
7. **TEST thoroughly** - Check all pages and components
8. **FOLLOW the guidelines** - Refer to UI_Guidelines.md for details

---

## FILES TO MODIFY

### Core Design System
1. `frontend/src/styles/tokens.css` - Color, typography, spacing variables
2. `frontend/src/styles/global.css` - Global styles and resets
3. `frontend/index.html` - Font imports

### Components
4. `frontend/src/components/Button/Button.jsx` - Button component
5. `frontend/src/components/Button/Button.module.css` - Button styles
6. `frontend/src/components/Input/Input.jsx` - Input component
7. `frontend/src/components/Input/Input.module.css` - Input styles
8. `frontend/src/components/Select/Select.jsx` - Select component
9. `frontend/src/components/Select/Select.module.css` - Select styles
10. `frontend/src/components/Card/Card.jsx` - Card component
11. `frontend/src/components/Card/Card.module.css` - Card styles

### Layout
12. `frontend/src/layouts/AppShell/AppShell.jsx` - Sidebar and topbar
13. `frontend/src/layouts/AppShell/AppShell.module.css` - Layout styles

### Pages
14. `frontend/src/pages/HomePage.jsx` - Homepage redesign
15. `frontend/src/pages/HomePage.module.css` - Homepage styles
16. `frontend/src/pages/customer/CreateServiceRequestPage.jsx` - Form redesign
17. `frontend/src/pages/customer/CreateServiceRequestPage.module.css` - Form styles
18. `frontend/src/pages/DashboardPage.jsx` - Dashboard redesign
19. `frontend/src/pages/DashboardPage.module.css` - Dashboard styles
20. `frontend/src/pages/customer/BookingsPage.jsx` - Bookings redesign
21. `frontend/src/pages/customer/BookingsPage.module.css` - Bookings styles
22. `frontend/src/pages/shared/InvoicesPage.jsx` - Invoices redesign
23. `frontend/src/pages/shared/InvoicesPage.module.css` - Invoices styles

### Images
24. Create `frontend/public/images/` directory structure
25. Add placeholder images or generate new ones

---

This is a comprehensive UI redesign that will transform CareConnect from a clinical blue theme to a warm, vibrant, and visually appealing application while maintaining all existing functionality. The new design will be image-rich, use beautiful colors consistently, and provide an excellent user experience across all devices.
