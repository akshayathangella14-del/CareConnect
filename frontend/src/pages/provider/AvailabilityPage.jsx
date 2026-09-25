import { useState } from 'react';
import { useListAvailabilityQuery, useCreateAvailabilityMutation, useRemoveAvailabilityMutation } from '@/features/availability';
import { Card, Button, Select, Input, Alert, EmptyState } from '@/components';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker/TimePicker';
import { CalendarDays, Plus, Trash2, Clock } from 'lucide-react';

export default function AvailabilityPage() {
  const { data: slots = [], isLoading } = useListAvailabilityQuery({ mine: 'true' });
  const [createSlot, { isLoading: isCreating }] = useCreateAvailabilityMutation();
  const [removeSlot] = useRemoveAvailabilityMutation();

  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '17:00',
    timezone: 'Asia/Kolkata'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        startAt: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
        endAt: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
        timezone: formData.timezone,
      };
      await createSlot(payload).unwrap();
    } catch (err) {
      console.error('Failed to add slot:', err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeSlot(id).unwrap();
    } catch (err) {
      console.error('Failed to remove slot:', err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>My Schedule</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Set your regular working hours to receive accurate job matches.</p>
      </div>

      <Card padding="lg">
        <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Add Availability Slot</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(value) => setFormData((prev) => ({ ...prev, startDate: value }))}
              />
            <TimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
              />
            <DatePicker
                label="End Date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(value) => setFormData((prev) => ({ ...prev, endDate: value }))}
              />
            <TimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
              />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>Timezone</label>
            <Input
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" loading={isCreating} leftIcon={<Plus size={18} />}>Add Availability Slot</Button>
        </form>
      </Card>

      <Card padding="lg">
        <h3 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-4)' }}>Current Availability</h3>

        {isLoading ? (
          <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>Loading schedule...</div>
        ) : slots.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={28} />}
            title="No availability set"
            description="You haven't added any availability slots yet."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {slots.sort((a, b) => new Date(a.startAt) - new Date(b.startAt)).map(slot => (
              <div key={slot._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Clock size={16} color="var(--color-text-secondary)" />
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {new Date(slot.startAt).toLocaleDateString()} {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                      to {new Date(slot.endAt).toLocaleDateString()} {new Date(slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleRemove(slot._id)} style={{ color: 'var(--color-error)' }}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
