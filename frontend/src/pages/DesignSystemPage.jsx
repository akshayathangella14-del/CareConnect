import { useState } from 'react';
import {
  Home, Users, Settings, Search, Bell, Star,
  Shield, Zap, Heart, MapPin, Calendar, Clock,
  Mail, Phone, Camera, FileText, Plus, Check,
  AlertTriangle, Info, Package, ArrowRight,
} from 'lucide-react';
import {
  Button, Input, Textarea, Badge, Card,
  Alert, Divider, Skeleton, EmptyState, Spinner,
} from '@/components';
import styles from './DesignSystemPage.module.css';

/**
 * DesignSystemPage — Development-only showcase.
 *
 * Demonstrates all CareConnect design tokens and UI primitives
 * for visual verification and design system documentation.
 */
function DesignSystemPage() {
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className={styles.ds}>
      {/* ================================================================
          TYPOGRAPHY
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles.ds__sectionHeader || styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Typography</h2>
          <p className={styles['ds__section-desc']}>
            Inter font family with a clear hierarchy from Display to Caption.
            Responsive typography reduces heading sizes on smaller viewports.
          </p>
        </div>

        <div className={styles.ds__subsection}>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>Display</span>
            <span className={styles['ds__type-spec']}>40px / 700</span>
            <span style={{ fontSize: 'var(--font-size-display)', fontWeight: 700, lineHeight: 'var(--line-height-tight)' }}>
              Home Services
            </span>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>H1</span>
            <span className={styles['ds__type-spec']}>32px / 600</span>
            <h1 style={{ fontSize: 'var(--font-size-h1)' }}>Heading One</h1>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>H2</span>
            <span className={styles['ds__type-spec']}>24px / 600</span>
            <h2 style={{ fontSize: 'var(--font-size-h2)' }}>Heading Two</h2>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>H3</span>
            <span className={styles['ds__type-spec']}>20px / 600</span>
            <h3>Heading Three</h3>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>H4</span>
            <span className={styles['ds__type-spec']}>17px / 600</span>
            <h4>Heading Four</h4>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>Body Large</span>
            <span className={styles['ds__type-spec']}>16px / 400</span>
            <p style={{ fontSize: 'var(--font-size-body-lg)', color: 'var(--color-text-primary)' }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>Body</span>
            <span className={styles['ds__type-spec']}>14px / 400</span>
            <p style={{ color: 'var(--color-text-primary)' }}>
              Default body text used throughout the application.
            </p>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>Small</span>
            <span className={styles['ds__type-spec']}>13px / 400</span>
            <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
              Small text for secondary information.
            </span>
          </div>
          <div className={styles['ds__type-row']}>
            <span className={styles['ds__type-label']}>Caption</span>
            <span className={styles['ds__type-spec']}>12px / 500</span>
            <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 500, color: 'var(--color-text-muted)' }}>
              Caption text for labels and metadata.
            </span>
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          COLORS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Colors</h2>
          <p className={styles['ds__section-desc']}>
            Warm Precision palette — 80-85% neutrals, 10-12% primary brand, 2-4% accent.
            Semantic colors for meaning only.
          </p>
        </div>

        {/* Brand Colors */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Brand</h3>
          <div className={styles['ds__color-grid']}>
            {brandColors.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Neutrals</h3>
          <div className={styles['ds__color-grid']}>
            {neutralColors.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Text</h3>
          <div className={styles['ds__color-grid']}>
            {textColors.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </div>

        {/* Semantic Colors */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Semantic</h3>
          <div className={styles['ds__color-grid']}>
            {semanticColors.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          SPACING
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Spacing</h2>
          <p className={styles['ds__section-desc']}>
            4px base grid system. Consistent spacing across all components and layouts.
          </p>
        </div>
        <div className={styles['ds__spacing-grid']}>
          {spacingScale.map((s) => (
            <div key={s.token} className={styles['ds__spacing-item']}>
              <span className={styles['ds__spacing-label']}>{s.token}</span>
              <div
                className={styles['ds__spacing-bar']}
                style={{ width: s.value }}
              />
              <span className={styles['ds__spacing-label']}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ================================================================
          BORDER RADIUS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Border Radius</h2>
          <p className={styles['ds__section-desc']}>
            Consistent radius scale from tiny elements to pill-shaped badges.
          </p>
        </div>
        <div className={styles['ds__radius-grid']}>
          {radiusScale.map((r) => (
            <div key={r.label} className={styles['ds__radius-item']}>
              <div
                className={styles['ds__radius-box']}
                style={{ borderRadius: r.value }}
              />
              <span className={styles['ds__radius-label']}>{r.label}</span>
              <span className={styles['ds__radius-label']}>{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ================================================================
          SHADOWS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Shadows</h2>
          <p className={styles['ds__section-desc']}>
            Restrained shadow system — prefer surface + border over heavy shadows.
          </p>
        </div>
        <div className={styles['ds__shadow-grid']}>
          <div className={styles['ds__shadow-item']}>
            <div className={styles['ds__shadow-box']} style={{ boxShadow: 'none' }}>
              <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>none</span>
            </div>
            <span className={styles['ds__shadow-label']}>shadow-none</span>
          </div>
          <div className={styles['ds__shadow-item']}>
            <div className={styles['ds__shadow-box']} style={{ boxShadow: 'var(--shadow-subtle)' }}>
              <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>subtle</span>
            </div>
            <span className={styles['ds__shadow-label']}>shadow-subtle</span>
          </div>
          <div className={styles['ds__shadow-item']}>
            <div className={styles['ds__shadow-box']} style={{ boxShadow: 'var(--shadow-overlay)' }}>
              <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>overlay</span>
            </div>
            <span className={styles['ds__shadow-label']}>shadow-overlay</span>
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          BUTTONS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Buttons</h2>
          <p className={styles['ds__section-desc']}>
            Four variants, three sizes, with loading and disabled states.
          </p>
        </div>

        {/* Variants */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Variants</h3>
          <div className={styles.ds__row}>
            <Button variant="primary">Primary (Coral)</Button>
            <Button variant="accent">Accent (Amber)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Sizes</h3>
          <div className={styles.ds__row}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>

        {/* With Icons */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>With Icons</h3>
          <div className={styles.ds__row}>
            <Button variant="primary" leftIcon={<Plus size={16} />}>Add Service</Button>
            <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>Continue</Button>
            <Button variant="ghost" leftIcon={<Search size={16} />}>Search</Button>
          </div>
        </div>

        {/* States */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>States</h3>
          <div className={styles.ds__row}>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="secondary" loading>Loading</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Full Width */}
        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Full Width</h3>
          <div style={{ maxWidth: 400 }}>
            <Button variant="primary" fullWidth leftIcon={<Check size={16} />}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          FORM INPUTS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Form Inputs</h2>
          <p className={styles['ds__section-desc']}>
            Text inputs and textareas with label, error, helper text, and icon support.
          </p>
        </div>

        <div className={styles['ds__form-demo']}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            helperText="As it appears on your ID"
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            leftIcon={<Phone size={16} />}
            error="Phone number is required"
          />
          <Input
            label="Location"
            placeholder="Enter your address"
            leftIcon={<MapPin size={16} />}
            disabled
          />
          <div className={styles['ds__form-demo--full']}>
            <Textarea
              label="Service Description"
              placeholder="Describe the service you need..."
              helperText="Be as specific as possible for accurate matching"
              maxLength={500}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
          <div className={styles['ds__form-demo--full']}>
            <Textarea
              label="Error Example"
              placeholder="This field has an error..."
              error="Please provide a more detailed description (minimum 20 characters)"
              value=""
              readOnly
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          BADGES
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Badges</h2>
          <p className={styles['ds__section-desc']}>
            Semantic status indicators for categorization and state display.
          </p>
        </div>

        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Variants</h3>
          <div className={styles.ds__row}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="violet">AI / Violet</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </div>

        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>With Dot Indicator</h3>
          <div className={styles.ds__row}>
            <Badge variant="primary" dot>AI Matched</Badge>
            <Badge variant="accent" dot>Scope Alert</Badge>
            <Badge variant="violet" dot>Gemini Insight</Badge>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
            <Badge variant="error" dot>Overdue</Badge>
            <Badge variant="info" dot>In Progress</Badge>
            <Badge variant="neutral" dot>Draft</Badge>
          </div>
        </div>

        <div className={styles.ds__subsection}>
          <h3 className={styles['ds__subsection-title']}>Usage Examples</h3>
          <div className={styles.ds__row}>
            <Badge variant="success" dot>Verified Provider</Badge>
            <Badge variant="primary">AI Matched</Badge>
            <Badge variant="warning" dot>Quote Pending</Badge>
            <Badge variant="info">4.8 ★</Badge>
            <Badge variant="neutral">12 Reviews</Badge>
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          CARDS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Cards</h2>
          <p className={styles['ds__section-desc']}>
            Content containers with header, body, and footer compound components.
          </p>
        </div>

        <div className={`${styles.ds__row} ${styles['ds__row--start']}`}>
          {/* Default Card */}
          <div className={styles['ds__demo-card']}>
            <Card variant="default">
              <Card.Header
                title="Service Request"
                subtitle="Created 2 hours ago"
                action={<Badge variant="success" dot>Active</Badge>}
              />
              <Card.Body>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                  Plumbing repair needed for kitchen sink. Leaking faucet with
                  possible pipe damage underneath.
                </p>
              </Card.Body>
              <Card.Footer>
                <Button variant="ghost" size="sm">Decline</Button>
                <Button variant="primary" size="sm">Accept</Button>
              </Card.Footer>
            </Card>
          </div>

          {/* Elevated Card */}
          <div className={styles['ds__demo-card']}>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-body-lg)', fontWeight: 600 }}>Mike Johnson</h4>
                    <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>
                      Licensed Electrician
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Badge variant="success" dot>Verified</Badge>
                  <Badge variant="info">4.9 ★</Badge>
                  <Badge variant="neutral">127 Jobs</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          ALERTS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Alerts</h2>
          <p className={styles['ds__section-desc']}>
            Semantic notification banners for contextual messages.
          </p>
        </div>

        <div className={`${styles.ds__row} ${styles['ds__row--column']}`} style={{ maxWidth: 600 }}>
          <Alert variant="info" title="Service Update">
            Your service request has been matched with 3 qualified providers in your area.
          </Alert>
          <Alert variant="success" title="Booking Confirmed">
            Your plumbing service has been scheduled for tomorrow at 10:00 AM.
          </Alert>
          <Alert variant="warning" title="Action Required">
            Please upload evidence photos to complete the service verification.
          </Alert>
          <Alert variant="error" title="Payment Failed">
            We could not process your payment. Please update your payment method.
          </Alert>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          DIVIDERS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Dividers</h2>
          <p className={styles['ds__section-desc']}>
            Visual separators with optional labels for content sections.
          </p>
        </div>
        <div style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Default divider:</p>
            <Divider />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Labeled divider:</p>
            <Divider label="Or continue with" />
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          SKELETON & LOADING
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Skeleton & Loading</h2>
          <p className={styles['ds__section-desc']}>
            Loading placeholders and spinners for async content.
          </p>
        </div>

        <div className={`${styles.ds__row} ${styles['ds__row--start']}`}>
          {/* Skeleton Card */}
          <div className={styles['ds__demo-card']}>
            <Card variant="default" padding="md">
              <div className={styles['ds__skeleton-demo']}>
                <div className={styles['ds__skeleton-row']}>
                  <Skeleton variant="circle" width={44} height={44} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="45%" />
                  </div>
                </div>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rect" height={36} width={120} />
              </div>
            </Card>
          </div>

          {/* Spinners */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
            <div className={styles.ds__row}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
            <Spinner size="md" showLabel label="Loading services..." />
          </div>
        </div>
      </section>

      <Divider />

      {/* ================================================================
          EMPTY STATE
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Empty State</h2>
          <p className={styles['ds__section-desc']}>
            Placeholder for views with no data.
          </p>
        </div>

        <Card variant="default">
          <EmptyState
            icon={<Package size={28} />}
            title="No service requests yet"
            description="When you create a service request, it will appear here. Get started by describing the service you need."
            action={
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                Create Service Request
              </Button>
            }
          />
        </Card>
      </section>

      <Divider />

      {/* ================================================================
          ICONS
          ================================================================ */}
      <section className={styles.ds__section}>
        <div className={styles['ds__section-header']}>
          <h2 className={styles['ds__section-title']}>Icons</h2>
          <p className={styles['ds__section-desc']}>
            Lucide React — consistent stroke style, supporting text rather than replacing labels.
          </p>
        </div>

        <div className={styles['ds__icon-grid']}>
          {iconSamples.map(({ Icon, name }) => (
            <div key={name} className={styles['ds__icon-item']}>
              <Icon size={22} />
              <span className={styles['ds__icon-name']}>{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   COLOR SWATCH HELPER
   ================================================================ */
function ColorSwatch({ name, value, textColor }) {
  return (
    <div className={styles['ds__color-swatch']}>
      <div
        className={styles['ds__color-preview']}
        style={{ backgroundColor: value }}
      />
      <div className={styles['ds__color-info']}>
        <div className={styles['ds__color-name']}>{name}</div>
        <div className={styles['ds__color-value']}>{value}</div>
      </div>
    </div>
  );
}

/* ================================================================
   DATA
   ================================================================ */
const brandColors = [
  { name: 'Primary (Coral)', value: '#FF6B6B' },
  { name: 'Primary Hover', value: '#E55A5A' },
  { name: 'Primary Soft', value: '#FFF0F0' },
  { name: 'Primary 100', value: '#FFD4D4' },
  { name: 'Primary Dark', value: '#CC4444' },
  { name: 'Secondary (Teal)', value: '#4ECDC4' },
  { name: 'Secondary Hover', value: '#3DB5AD' },
  { name: 'Secondary Soft', value: '#E8F8F7' },
  { name: 'Accent (Amber)', value: '#FFB84D' },
  { name: 'Accent Soft', value: '#FFF8E8' },
];

const neutralColors = [
  { name: 'Background', value: '#FFFFFF' },
  { name: 'Surface', value: '#FAFAFA' },
  { name: 'Surface Muted', value: '#F5F5F5' },
  { name: 'Surface Warm', value: '#FFF9F9' },
  { name: 'Border', value: '#E0E0E0' },
  { name: 'Border Strong', value: '#CCCCCC' },
];

const textColors = [
  { name: 'Primary Text', value: '#2D3436' },
  { name: 'Secondary Text', value: '#636E72' },
  { name: 'Muted Text', value: '#B2BEC3' },
  { name: 'Disabled Text', value: '#DFE6E9' },
];

const semanticColors = [
  { name: 'Success', value: '#16A34A' },
  { name: 'Success Soft', value: '#F0FDF4' },
  { name: 'Warning', value: '#D97706' },
  { name: 'Warning Soft', value: '#FFFBEB' },
  { name: 'Error', value: '#DC2626' },
  { name: 'Error Soft', value: '#FEF2F2' },
  { name: 'Info', value: '#2563EB' },
  { name: 'Info Soft', value: '#EFF6FF' },
];

const spacingScale = [
  { token: '--space-1', value: '4px' },
  { token: '--space-2', value: '8px' },
  { token: '--space-3', value: '12px' },
  { token: '--space-4', value: '16px' },
  { token: '--space-5', value: '20px' },
  { token: '--space-6', value: '24px' },
  { token: '--space-8', value: '32px' },
  { token: '--space-10', value: '40px' },
  { token: '--space-12', value: '48px' },
  { token: '--space-16', value: '64px' },
  { token: '--space-20', value: '80px' },
  { token: '--space-24', value: '96px' },
];

const radiusScale = [
  { label: 'xs', value: '4px' },
  { label: 'sm', value: '6px' },
  { label: 'md', value: '10px' },
  { label: 'lg', value: '14px' },
  { label: 'xl', value: '20px' },
  { label: 'pill', value: '999px' },
];

const iconSamples = [
  { Icon: Home, name: 'Home' },
  { Icon: Users, name: 'Users' },
  { Icon: Settings, name: 'Settings' },
  { Icon: Search, name: 'Search' },
  { Icon: Bell, name: 'Bell' },
  { Icon: Star, name: 'Star' },
  { Icon: Shield, name: 'Shield' },
  { Icon: Zap, name: 'Zap' },
  { Icon: Heart, name: 'Heart' },
  { Icon: MapPin, name: 'MapPin' },
  { Icon: Calendar, name: 'Calendar' },
  { Icon: Clock, name: 'Clock' },
  { Icon: Mail, name: 'Mail' },
  { Icon: Phone, name: 'Phone' },
  { Icon: Camera, name: 'Camera' },
  { Icon: FileText, name: 'FileText' },
];

export default DesignSystemPage;
