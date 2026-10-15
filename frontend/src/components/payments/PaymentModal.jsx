import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CheckCircle2, 
  Download, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Modal, Button } from '@/components';
import { useCreatePaymentMutation } from '@/features/payments';
import styles from './PaymentModal.module.css';

const paymentMethods = [
  { id: 'CARD', label: 'Card', subtitle: 'Visa, Mastercard, RuPay', icon: <CreditCard size={18} /> },
  { id: 'UPI', label: 'UPI / QR', subtitle: 'GPay, PhonePe, Paytm', icon: <Smartphone size={18} /> },
  { id: 'NETBANKING', label: 'Net Banking', subtitle: 'All Indian Banks', icon: <Landmark size={18} /> },
  { id: 'WALLET', label: 'Wallet', subtitle: 'Paytm, Amazon Pay', icon: <Wallet size={18} /> },
];

const popularBanks = [
  { id: 'HDFC', name: 'HDFC Bank', color: '#004c8f', initials: 'HDFC' },
  { id: 'SBI', name: 'State Bank of India', color: '#280071', initials: 'SBI' },
  { id: 'ICICI', name: 'ICICI Bank', color: '#b02a30', initials: 'ICICI' },
  { id: 'AXIS', name: 'Axis Bank', color: '#97144d', initials: 'AXIS' },
  { id: 'KOTAK', name: 'Kotak Mahindra', color: '#ed1c24', initials: 'KOTAK' },
  { id: 'PNB', name: 'Punjab National', color: '#a20034', initials: 'PNB' },
];

export default function PaymentModal({ isOpen, invoice, onClose, onSuccess }) {
  const [createPayment, { isLoading: isApiPaying }] = useCreatePaymentMutation();

  // Navigation & Phases: 'CHECKOUT' | 'PROCESSING' | 'OTP' | 'SUCCESS'
  const [phase, setPhase] = useState('CHECKOUT');
  const [method, setMethod] = useState('CARD');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedPayment, setCompletedPayment] = useState(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4532 8921 4452 8892');
  const [cardHolder, setCardHolder] = useState('John Doe');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [saveCard, setSaveCard] = useState(true);

  // UPI State
  const [upiMode, setUpiMode] = useState('QR'); // 'QR' or 'VPA'
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [vpaVerified, setVpaVerified] = useState(true);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(299);

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('PAYTM');

  // OTP State
  const [otpValues, setOtpValues] = useState(['7', '4', '9', '2', '0', '1']);
  const [otpTimer, setOtpTimer] = useState(28);

  // Reset or initialize when invoice opens
  useEffect(() => {
    if (isOpen) {
      setPhase('CHECKOUT');
      setErrorMsg('');
      setCompletedPayment(null);
      setQrSecondsLeft(299);
      setOtpTimer(28);
    }
  }, [isOpen, invoice]);

  // QR Code Timer countdown
  useEffect(() => {
    if (isOpen && method === 'UPI' && upiMode === 'QR' && phase === 'CHECKOUT') {
      const interval = setInterval(() => {
        setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, method, upiMode, phase]);

  // OTP countdown
  useEffect(() => {
    if (phase === 'OTP' && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, otpTimer]);

  if (!invoice) return null;

  const totalAmount = Number(invoice.total || 0);
  const currency = invoice.currency || 'INR';
  const invoiceIdDisplay = invoice.invoiceNumber || `INV-${String(invoice._id || '').slice(0, 8).toUpperCase()}`;

  // Card Brand Detection
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6')) return 'RUPAY';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleFillTestCard = () => {
    setCardNumber('4532 8921 4452 8892');
    setCardHolder('Akshaya T');
    setCardExpiry('12/28');
    setCardCvv('892');
  };

  // Start payment flow
  const handleProceedToAuth = () => {
    setErrorMsg('');
    setPhase('PROCESSING');

    // Simulate 800ms of gateway handoff before 3D-secure / OTP step
    setTimeout(() => {
      setPhase('OTP');
    }, 850);
  };

  // Final confirmation when OTP is approved or QR simulated
  const handleFinalizePayment = async () => {
    setErrorMsg('');
    setPhase('PROCESSING');

    try {
      const response = await createPayment({
        invoiceId: invoice._id,
        amount: totalAmount,
        currency,
        method,
        metadata: {
          gateway: 'CareConnect 3D-Secure 2.0',
          methodDetails: method === 'CARD' ? `Card ending in ${cardNumber.slice(-4)}` : method === 'UPI' ? upiId : selectedBank,
          authorizedAt: new Date().toISOString(),
        },
      }).unwrap();

      const paymentRecord = response?.data?.payment || response?.payment || {
        _id: `txn_${Date.now()}`,
        gatewayTransactionId: `CC-TXN-${Date.now().toString().slice(-6)}`,
        amount: totalAmount,
        currency,
        paidAt: new Date().toISOString(),
        method,
      };

      setCompletedPayment(paymentRecord);
      setPhase('SUCCESS');
      onSuccess?.();
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMsg(err?.data?.error?.message || err?.data?.error || 'Payment authorization failed. Please try again.');
      setPhase('CHECKOUT');
    }
  };

  const handleDownloadReceipt = () => {
    const token = localStorage.getItem('careconnect_token');
    const url = `/api/v1/invoices/${invoice._id}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    window.open(url, '_blank');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={phase === 'PROCESSING' ? () => {} : onClose}
      title={
        phase === 'SUCCESS' ? 'Transaction Receipt' : 
        phase === 'OTP' ? 'Bank 3D-Secure Authentication' : 
        'CareConnect Secure Checkout'
      }
      size="md"
      footer={
        phase === 'CHECKOUT' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProceedToAuth}
              leftIcon={<Lock size={15} />}
              style={{ paddingLeft: 'var(--space-5)', paddingRight: 'var(--space-5)' }}
            >
              Pay {currency} {totalAmount.toFixed(2)}
            </Button>
          </div>
        ) : phase === 'OTP' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button variant="ghost" onClick={() => setPhase('CHECKOUT')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFinalizePayment}
              loading={isApiPaying}
              leftIcon={<CheckCircle2 size={16} />}
            >
              Submit OTP & Authorize
            </Button>
          </div>
        ) : phase === 'SUCCESS' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 'var(--space-3)' }}>
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
              onClick={handleDownloadReceipt}
              style={{ flex: 1 }}
            >
              Download PDF Receipt
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
              }}
              style={{ flex: 1 }}
            >
              Done
            </Button>
          </div>
        ) : null
      }
    >
      <div className={styles.modalContainer}>
        {/* Trust & Compliance Banner */}
        {phase !== 'SUCCESS' && (
          <div className={styles.securityBanner}>
            <div className={styles.securityItem}>
              <Lock size={13} color="var(--color-primary)" />
              <span>256-Bit SSL Encrypted Payment</span>
            </div>
            <span className={styles.securityBadge}>PCI-DSS Level 1</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        {/* ========================================================
            PHASE 1: CHECKOUT SCREEN
            ======================================================== */}
        {phase === 'CHECKOUT' && (
          <>
            {/* Order Summary Card */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryInvoiceId}>{invoiceIdDisplay}</span>
                <span style={{ fontSize: 11, background: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-primary-dark)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  PAYABLE NOW
                </span>
              </div>
              <div className={styles.summaryTotalRow}>
                <span className={styles.summaryLabel}>Total Amount Due</span>
                <span className={styles.summaryAmount}>
                  {currency} {totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className={styles.breakdownToggle}
                onClick={() => setShowBreakdown(!showBreakdown)}
              >
                <span>{showBreakdown ? 'Hide price breakdown' : 'View price breakdown'}</span>
                {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showBreakdown && (
                <div className={styles.breakdownDetails}>
                  <div className={styles.breakdownRow}>
                    <span>Service Charges</span>
                    <span>{currency} {(invoice.subtotal || totalAmount * 0.85).toFixed(2)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Platform & Convenience Fee</span>
                    <span>{currency} {(invoice.platformFee || totalAmount * 0.10).toFixed(2)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Applicable GST / Tax</span>
                    <span>{currency} {(invoice.tax || totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector Tabs */}
            <div className={styles.methodTabs}>
              {paymentMethods.map((m) => {
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.methodTab} ${isActive ? styles.methodTabActive : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* METHOD PANEL: CARD */}
            {method === 'CARD' && (
              <div className={styles.tabContent}>
                {/* Virtual Card Interactive Preview */}
                <div className={styles.cardPreview}>
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardChip}>
                      <div className={styles.cardChipLines} />
                    </div>
                    <span className={styles.cardNetworkLogo}>
                      {getCardBrand(cardNumber)}
                    </span>
                  </div>
                  <div className={styles.cardNumberDisplay}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className={styles.cardBottomRow}>
                    <div>
                      <div className={styles.cardHolderLabel}>Card Holder</div>
                      <div className={styles.cardHolderValue}>{cardHolder || 'YOUR NAME'}</div>
                    </div>
                    <div>
                      <div className={styles.cardExpiryLabel}>Expires</div>
                      <div className={styles.cardExpiryValue}>{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.testCardButton}
                  onClick={handleFillTestCard}
                >
                  <Sparkles size={13} />
                  <span>Use Demo Card (Auto-fill)</span>
                </button>

                {/* Card Inputs Form */}
                <div className={styles.formGrid}>
                  <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <label className={styles.inputLabel}>Card Number</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8921 4452 8892"
                      maxLength={19}
                    />
                  </div>

                  <div className={`${styles.inputGroup} ${styles.formGridFull}`}>
                    <label className={styles.inputLabel}>Cardholder Name</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name as on card"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Valid Thru</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>CVV / CVC</label>
                    <input
                      type="password"
                      className={styles.textInput}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <span>Save card securely as per RBI tokenization guidelines</span>
                </label>
              </div>
            )}

            {/* METHOD PANEL: UPI */}
            {method === 'UPI' && (
              <div className={styles.tabContent}>
                <div className={styles.upiSubtabs}>
                  <button
                    type="button"
                    className={`${styles.upiSubtab} ${upiMode === 'QR' ? styles.upiSubtabActive : ''}`}
                    onClick={() => setUpiMode('QR')}
                  >
                    <QrCode size={15} />
                    <span>Scan UPI QR</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.upiSubtab} ${upiMode === 'VPA' ? styles.upiSubtabActive : ''}`}
                    onClick={() => setUpiMode('VPA')}
                  >
                    <Smartphone size={15} />
                    <span>Enter UPI ID</span>
                  </button>
                </div>

                {upiMode === 'QR' ? (
                  <div className={styles.qrContainer}>
                    <div className={styles.qrBox}>
                      {/* SVG Realistic QR Code Graphic */}
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <rect width="160" height="160" fill="#ffffff" />
                        {/* Corner markers */}
                        <rect x="10" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="18" y="18" width="24" height="24" fill="#ffffff" />
                        <rect x="22" y="22" width="16" height="16" fill="#7c3aed" rx="2" />

                        <rect x="110" y="10" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="118" y="18" width="24" height="24" fill="#ffffff" />
                        <rect x="122" y="22" width="16" height="16" fill="#7c3aed" rx="2" />

                        <rect x="10" y="110" width="40" height="40" fill="#0f172a" rx="4" />
                        <rect x="18" y="118" width="24" height="24" fill="#ffffff" />
                        <rect x="22" y="122" width="16" height="16" fill="#7c3aed" rx="2" />

                        {/* Simulated data matrix cells */}
                        <rect x="60" y="15" width="8" height="8" fill="#1e293b" />
                        <rect x="75" y="15" width="8" height="8" fill="#1e293b" />
                        <rect x="90" y="25" width="8" height="8" fill="#1e293b" />
                        <rect x="60" y="35" width="12" height="8" fill="#1e293b" />
                        <rect x="80" y="45" width="15" height="8" fill="#1e293b" />
                        
                        <rect x="15" y="60" width="10" height="8" fill="#1e293b" />
                        <rect x="35" y="60" width="10" height="8" fill="#1e293b" />
                        <rect x="25" y="75" width="14" height="8" fill="#1e293b" />
                        <rect x="15" y="90" width="15" height="8" fill="#1e293b" />

                        <rect x="115" y="60" width="8" height="12" fill="#1e293b" />
                        <rect x="135" y="75" width="12" height="8" fill="#1e293b" />
                        <rect x="120" y="90" width="8" height="8" fill="#1e293b" />

                        <rect x="60" y="115" width="12" height="8" fill="#1e293b" />
                        <rect x="80" y="125" width="10" height="10" fill="#1e293b" />
                        <rect x="100" y="135" width="8" height="8" fill="#1e293b" />
                        <rect x="125" y="115" width="12" height="12" fill="#1e293b" />

                        {/* Center CareConnect Brand Badge */}
                        <rect x="64" y="64" width="32" height="32" rx="8" fill="#7c3aed" />
                        <text x="80" y="85" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">C</text>
                      </svg>
                    </div>

                    <div className={styles.qrTimer}>
                      <Clock size={13} color="var(--color-primary)" />
                      <span>QR Code valid for {formatTimer(qrSecondsLeft)}</span>
                    </div>

                    <div className={styles.appBadges}>
                      <span className={styles.appPill}>Google Pay</span>
                      <span className={styles.appPill}>PhonePe</span>
                      <span className={styles.appPill}>Paytm</span>
                      <span className={styles.appPill}>BHIM UPI</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleProceedToAuth}
                      style={{ marginTop: 'var(--space-2)' }}
                    >
                      <Sparkles size={14} /> Simulate App Payment Approval
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Enter Virtual Payment Address (UPI ID)</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          className={styles.textInput}
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setVpaVerified(Boolean(e.target.value.includes('@')));
                          }}
                          placeholder="yourname@okhdfcbank"
                        />
                      </div>
                    </div>

                    <div className={styles.handlePills}>
                      {['@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@upi'].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          className={styles.handlePill}
                          onClick={() => {
                            const prefix = upiId.split('@')[0] || 'customer';
                            setUpiId(`${prefix}${handle}`);
                            setVpaVerified(true);
                          }}
                        >
                          {handle}
                        </button>
                      ))}
                    </div>

                    {vpaVerified && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontSize: 12, background: '#DCFCE7', padding: '6px 12px', borderRadius: 6 }}>
                        <Check size={14} />
                        <span>Verified VPA • Fast authorization enabled</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* METHOD PANEL: NETBANKING */}
            {method === 'NETBANKING' && (
              <div className={styles.tabContent}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
                  Select from Popular Banks:
                </div>
                <div className={styles.bankGrid}>
                  {popularBanks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`${styles.bankOption} ${selectedBank === b.id ? styles.bankOptionSelected : ''}`}
                      onClick={() => setSelectedBank(b.id)}
                    >
                      <div className={styles.bankLogo} style={{ backgroundColor: b.color }}>
                        {b.initials.slice(0, 2)}
                      </div>
                      <span>{b.initials}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.inputGroup} style={{ marginTop: 'var(--space-2)' }}>
                  <label className={styles.inputLabel}>Or Choose Another Bank</label>
                  <select
                    className={styles.textInput}
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                    <option value="CANARA">Canara Bank</option>
                    <option value="INDUS">IndusInd Bank</option>
                    <option value="IDFC">IDFC FIRST Bank</option>
                    <option value="UNION">Union Bank of India</option>
                  </select>
                </div>
              </div>
            )}

            {/* METHOD PANEL: WALLET */}
            {method === 'WALLET' && (
              <div className={styles.tabContent}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { id: 'PAYTM', name: 'Paytm Wallet', balance: 'Available' },
                    { id: 'AMAZON', name: 'Amazon Pay Balance', balance: 'Available' },
                    { id: 'PHONEPE', name: 'PhonePe Wallet', balance: 'Available' },
                    { id: 'MOBIKWIK', name: 'MobiKwik Wallet', balance: 'Available' },
                  ].map((w) => (
                    <label
                      key={w.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        border: selectedWallet === w.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: selectedWallet === w.id ? 'var(--color-primary-soft)' : '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio"
                          name="wallet"
                          checked={selectedWallet === w.id}
                          onChange={() => setSelectedWallet(w.id)}
                        />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{w.balance}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================
            PHASE 2: PROCESSING SPINNER
            ======================================================== */}
        {phase === 'PROCESSING' && (
          <div className={styles.authorizingContainer}>
            <div className={styles.pulsingSpinner} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 0' }}>
              Contacting Payment Gateway...
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: 0 }}>
              Connecting to issuing bank secure server. Please do not refresh or press back.
            </p>
          </div>
        )}

        {/* ========================================================
            PHASE 3: 3D-SECURE OTP AUTHENTICATION
            ======================================================== */}
        {phase === 'OTP' && (
          <div className={styles.otpCard}>
            <div className={styles.otpBankHeader}>
              <div className={styles.otpBankName}>
                {method === 'CARD' ? 'HDFC Bank SecurePay (3D-Secure 2.0)' : `${selectedBank || 'Bank'} Instant Authentication`}
              </div>
              <ShieldCheck size={20} color="#34D399" />
            </div>

            <div className={styles.otpBody}>
              <div className={styles.otpMetaRow}>
                <span>Merchant: <strong>CareConnect India Ltd.</strong></span>
                <span>Amount: <strong>{currency} {totalAmount.toFixed(2)}</strong></span>
              </div>

              <div>
                <p style={{ margin: '0 0 6px', fontSize: 14, color: 'var(--color-text-primary)' }}>
                  A 6-digit One-Time Password (OTP) has been sent to your registered mobile number ending in <strong>•••• 8921</strong>.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                  <Sparkles size={13} />
                  <span>Test Mode: Sample OTP <strong>749201</strong> pre-filled below for instant testing</span>
                </div>
              </div>

              <div className={styles.otpInputRow}>
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className={styles.otpBox}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1);
                      const updated = [...otpValues];
                      updated[idx] = val;
                      setOtpValues(updated);
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                <span>Resend OTP in: <strong>{otpTimer > 0 ? `0:${String(otpTimer).padStart(2, '0')}` : 'Available'}</strong></span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setOtpTimer(30)}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PHASE 4: PAYMENT SUCCESS RECEIPT CONFIRMATION
            ======================================================== */}
        {phase === 'SUCCESS' && (
          <div className={styles.successContainer}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={40} />
            </div>

            <div>
              <div className={styles.successTitle}>Payment Successful!</div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: '4px 0 0' }}>
                Your payment has been securely confirmed and settled.
              </p>
            </div>

            <div className={styles.successAmount}>
              {currency} {totalAmount.toFixed(2)}
            </div>

            <div className={styles.successReceiptCard}>
              <div className={styles.successReceiptRow}>
                <span className={styles.receiptLabel}>Transaction Reference:</span>
                <span className={styles.receiptValueMono}>
                  {completedPayment?.gatewayTransactionId || `CC-TXN-${Date.now().toString().slice(-6)}`}
                </span>
              </div>
              <div className={styles.successReceiptRow}>
                <span className={styles.receiptLabel}>Invoice ID:</span>
                <span className={styles.receiptValueMono}>{invoiceIdDisplay}</span>
              </div>
              <div className={styles.successReceiptRow}>
                <span className={styles.receiptLabel}>Payment Method:</span>
                <span className={styles.receiptValue}>
                  {method === 'CARD' ? `Credit Card (•••• ${cardNumber.slice(-4)})` : method === 'UPI' ? `UPI (${upiId})` : selectedBank}
                </span>
              </div>
              <div className={styles.successReceiptRow}>
                <span className={styles.receiptLabel}>Date & Time:</span>
                <span className={styles.receiptValue}>
                  {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={styles.successReceiptRow}>
                <span className={styles.receiptLabel}>Status:</span>
                <span style={{ color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, background: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                  <Check size={13} /> PAID & VERIFIED
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
