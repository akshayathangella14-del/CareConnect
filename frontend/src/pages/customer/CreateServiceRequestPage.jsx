import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateServiceRequestMutation, useSubmitServiceRequestMutation } from '@/features/serviceRequests';
import { useListCategoriesQuery } from '@/features/categories';
import { Card, Input, Textarea, Select, Button, Alert } from '@/components';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker/TimePicker';
import { ArrowRight, Wand2, Camera, X, Image as ImageIcon } from 'lucide-react';

export default function CreateServiceRequestPage() {
  const navigate = useNavigate();
  const [createRequest, { isLoading, error }] = useCreateServiceRequestMutation();
  const [submitRequest] = useSubmitServiceRequestMutation();
  const { data: categories = [], error: categoriesError } = useListCategoriesQuery();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 'NORMAL',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    preferredStartDate: '',
    preferredStartTime: '',
    preferredEndDate: '',
    preferredEndTime: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const attachments = imagePreviews.map((url) => ({
        url,
        type: 'IMAGE',
      }));

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        attachments,
        location: {
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          serviceArea: formData.city || formData.state || 'General Area',
        },
        preferredSchedule:
          formData.preferredStartDate && formData.preferredStartTime && formData.preferredEndDate && formData.preferredEndTime
            ? {
                startAt: new Date(`${formData.preferredStartDate}T${formData.preferredStartTime}`).toISOString(),
                endAt: new Date(`${formData.preferredEndDate}T${formData.preferredEndTime}`).toISOString(),
              }
            : undefined,
      };

      // Step 1: Create service request
      const result = await createRequest(payload).unwrap();
      const newRequestId = result?.data?.serviceRequest?._id || result?.serviceRequest?._id || result?._id;

      if (!newRequestId) {
        throw new Error('Could not retrieve created request ID');
      }

      // Step 2: Auto-submit for AI Review
      try {
        await submitRequest(newRequestId).unwrap();
      } catch (submitErr) {
        console.warn('Auto-submit encountered issue, proceeding to details page:', submitErr);
      }

      // Step 3: Navigate to request detail page
      navigate(`/service-requests/${newRequestId}`);
    } catch (err) {
      console.error('Failed to create request:', err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Request a Service</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Describe your problem in plain language and attach photos. CareConnect AI will analyze your issue, diagnose the root cause, and match you with verified technicians.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {error && (
            <Alert variant="error" title="Could not submit request">
              {error.data?.error?.message || 'An unexpected error occurred. Please try again.'}
            </Alert>
          )}

          {categoriesError && (
            <Alert variant="warning" title="Could not load categories">
              There was an error loading service categories. Please verify backend connectivity.
            </Alert>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', color: 'var(--color-text-primary)' }}>1. What issue are you experiencing?</h3>
            <Input
              label="Brief Title"
              name="title"
              placeholder="e.g., Refrigerator not cooling and leaking water"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              label="Describe the problem naturally"
              name="description"
              placeholder="e.g., Our fridge stopped freezing ice yesterday. The lower compartment feels warm, and there's a slight buzzing sound coming from behind..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />

            {/* Photo Upload Section */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
                Attach Appliance / Issue Photos (Optional - AI Vision Enhanced)
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                {imagePreviews.map((src, idx) => (
                  <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={src} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <label style={{ width: 80, height: 80, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-caption)' }}>
                  <Camera size={20} />
                  <span>Add Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} multiple />
                </label>
              </div>
            </div>

            <Select
              label="General Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Select closest category..."
              required
            />
            <Select
              label="Urgency Level"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              options={[
                { value: 'LOW', label: 'Low (Flexible schedule)' },
                { value: 'NORMAL', label: 'Normal (Within 2-3 days)' },
                { value: 'HIGH', label: 'High (As soon as possible)' },
                { value: 'EMERGENCY', label: 'Emergency (Needs immediate response)' },
              ]}
              required
            />
          </div>

          <hr style={{ border: 0, borderBottom: '1px solid var(--color-border-subtle)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', color: 'var(--color-text-primary)' }}>2. Location Details</h3>
            <Input
              label="Street Address"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <hr style={{ border: 0, borderBottom: '1px solid var(--color-border-subtle)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', color: 'var(--color-text-primary)' }}>3. Preferred Time Slot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <DatePicker
                  label="Start Date"
                  value={formData.preferredStartDate}
                  onChange={(value) => setFormData((prev) => ({ ...prev, preferredStartDate: value }))}
                />
              <TimePicker
                  label="Start Time"
                  value={formData.preferredStartTime}
                  onChange={(value) => setFormData((prev) => ({ ...prev, preferredStartTime: value }))}
                />
              <DatePicker
                  label="End Date"
                  value={formData.preferredEndDate}
                  min={formData.preferredStartDate}
                  onChange={(value) => setFormData((prev) => ({ ...prev, preferredEndDate: value }))}
                />
              <TimePicker
                  label="End Time"
                  value={formData.preferredEndTime}
                  onChange={(value) => setFormData((prev) => ({ ...prev, preferredEndTime: value }))}
                />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)' }}>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              leftIcon={<Wand2 size={18} />}
            >
              Analyze & Match with AI
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}