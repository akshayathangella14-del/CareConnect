import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetServiceRequestQuery, useCreateQuoteForRequestMutation } from '@/features/serviceRequests';
import { Card, Input, Textarea, Select, Button, Alert, Badge } from '@/components';
import { IndianRupee, Clock, Plus, Trash2 } from 'lucide-react';

export default function QuoteFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  
  const {
    data: request,
    isLoading: isLoadingRequest,
    error: requestError,
  } = useGetServiceRequestQuery(requestId, { skip: !requestId });
  const [createQuote, { isLoading: isCreating, error: createError }] = useCreateQuoteForRequestMutation();

  const [formData, setFormData] = useState({
    summary: '',
    labor: '',
    materials: '',
    tax: '',
    durationValue: '',
    durationUnit: 'HOURS',
    validUntilDays: '7',
  });

  const [tasks, setTasks] = useState([{ description: '', included: true }]);
  const [exclusions, setExclusions] = useState(['']);

  useEffect(() => {
    if (request && !formData.summary) {
      setFormData(prev => ({
        ...prev,
        summary: `Quote for: ${request.title}`
      }));
    }
  }, [request, formData.summary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].description = value;
    setTasks(newTasks);
  };

  const addTask = () => setTasks([...tasks, { description: '', included: true }]);
  const removeTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

  const handleExclusionChange = (index, value) => {
    const newExclusions = [...exclusions];
    newExclusions[index] = value;
    setExclusions(newExclusions);
  };

  const addExclusion = () => setExclusions([...exclusions, '']);
  const removeExclusion = (index) => setExclusions(exclusions.filter((_, i) => i !== index));

  const laborAmount = parseFloat(formData.labor) || 0;
  const materialsAmount = parseFloat(formData.materials) || 0;
  const taxAmount = parseFloat(formData.tax) || 0;
  const totalAmount = laborAmount + materialsAmount + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestId) return;

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(formData.validUntilDays, 10));

      const payload = {
        requestId,
        scope: {
          summary: formData.summary,
          tasks: tasks.filter(t => t.description.trim() !== ''),
          exclusions: exclusions.filter(e => e.trim() !== ''),
        },
        pricingBreakdown: {
          currency: 'INR', // Indian Rupees for CareConnect
          labor: laborAmount,
          materials: materialsAmount,
          tax: taxAmount,
        },
        totalAmount,
        estimatedDuration: {
          value: parseInt(formData.durationValue, 10),
          unit: formData.durationUnit,
        },
        validUntil: validUntil.toISOString(),
        submit: true, // Submit quote to make it visible to customer
      };

      await createQuote(payload).unwrap();
      navigate('/provider/bookings'); // Redirect to dashboard/bookings after quoting
    } catch (err) {
      console.error('Failed to submit quote:', err);
    }
  };

  if (!requestId) {
    return <Alert variant="error" title="Missing Information">No service request ID provided.</Alert>;
  }

  if (isLoadingRequest) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading request details...</div>;
  }

  if (requestError || !request) {
    return (
      <Alert variant="error" title="Could not load service request">
        {requestError?.data?.error?.message || requestError?.data?.message || 'The requested service is no longer available.'}
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Create Quote</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Submit a competitive and detailed quote for: <strong style={{ color: 'var(--color-text-primary)' }}>{request?.title}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {createError && (
          <Alert variant="error" title="Could not submit quote">
            {createError.data?.error?.message || createError.data?.message || 'An unexpected error occurred.'}
          </Alert>
        )}

        {/* Scope Section */}
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Scope of Work</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Textarea
              label="Scope Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              required
            />
            
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Included Tasks</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {tasks.map((task, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Input
                      placeholder="e.g., Replace P-trap under sink"
                      value={task.description}
                      onChange={(e) => handleTaskChange(idx, e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                    {tasks.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeTask(idx)} style={{ color: 'var(--color-error)' }}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addTask} style={{ alignSelf: 'flex-start' }} leftIcon={<Plus size={16} />}>
                  Add Task
                </Button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Exclusions (What's NOT included)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {exclusions.map((exclusion, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Input
                      placeholder="e.g., Drywall repair after pipe replacement"
                      value={exclusion}
                      onChange={(e) => handleExclusionChange(idx, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {exclusions.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeExclusion(idx)} style={{ color: 'var(--color-error)' }}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addExclusion} style={{ alignSelf: 'flex-start' }} leftIcon={<Plus size={16} />}>
                  Add Exclusion
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing Section */}
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Pricing & Schedule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            
            {/* Costs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Labor Cost"
                name="labor"
                type="number"
                min="0"
                step="0.01"
                value={formData.labor}
                onChange={handleChange}
                leftIcon={<IndianRupee size={16} />}
                required
              />
              <Input
                label="Materials Cost"
                name="materials"
                type="number"
                min="0"
                step="0.01"
                value={formData.materials}
                onChange={handleChange}
                leftIcon={<IndianRupee size={16} />}
              />
              <Input
                label="Estimated Tax"
                name="tax"
                type="number"
                min="0"
                step="0.01"
                value={formData.tax}
                onChange={handleChange}
                leftIcon={<IndianRupee size={16} />}
              />
              
              <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                <span style={{ fontWeight: 500 }}>Total Quote Amount</span>
                <span style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Time */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label="Estimated Duration"
                    name="durationValue"
                    type="number"
                    min="1"
                    value={formData.durationValue}
                    onChange={handleChange}
                    leftIcon={<Clock size={16} />}
                    required
                  />
                </div>
                <div style={{ width: 120 }}>
                  <Select
                    label="Unit"
                    name="durationUnit"
                    value={formData.durationUnit}
                    onChange={handleChange}
                    options={[
                      { value: 'HOURS', label: 'Hours' },
                      { value: 'DAYS', label: 'Days' },
                    ]}
                  />
                </div>
              </div>

              <Select
                label="Quote Valid For"
                name="validUntilDays"
                value={formData.validUntilDays}
                onChange={handleChange}
                options={[
                  { value: '3', label: '3 Days' },
                  { value: '7', label: '7 Days' },
                  { value: '14', label: '14 Days' },
                  { value: '30', label: '30 Days' },
                ]}
              />
            </div>
            
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
          <Button variant="secondary" onClick={() => navigate(-1)} type="button">Cancel</Button>
          <Button type="submit" loading={isCreating}>Submit Quote to Customer</Button>
        </div>
      </form>
    </div>
  );
}
