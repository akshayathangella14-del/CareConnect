import { useState, useEffect } from 'react';
import { useGetMeProviderQuery, useUpdateMeProviderMutation } from '@/features/providers';
import { Card, Input, Textarea, Button, Alert, Badge } from '@/components';
import { User, MapPin, DollarSign, Briefcase } from 'lucide-react';

export default function ProviderProfilePage() {
  const { data: profile, isLoading } = useGetMeProviderQuery();
  const [updateProfile, { isLoading: isUpdating, error: updateError, isSuccess }] = useUpdateMeProviderMutation();

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    experienceYears: '',
    baseHourlyRate: '',
    minimumVisitCharge: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        experienceYears: profile.experienceYears || '',
        baseHourlyRate: profile.pricing?.baseHourlyRate || '',
        minimumVisitCharge: profile.pricing?.minimumVisitCharge || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        experienceYears: Number(formData.experienceYears),
        pricing: {
          currency: 'USD',
          baseHourlyRate: Number(formData.baseHourlyRate),
          minimumVisitCharge: Number(formData.minimumVisitCharge)
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (isLoading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Provider Profile</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your public profile and pricing information.</p>
      </div>

      {isSuccess && (
        <Alert variant="success" title="Profile Updated">Your profile has been successfully saved.</Alert>
      )}

      {updateError && (
        <Alert variant="error" title="Update Failed">
          {updateError.data?.error || 'An error occurred while saving your profile.'}
        </Alert>
      )}

      <Card padding="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={18} color="var(--color-primary)" /> Basic Information
            </h3>
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-h2)', color: 'var(--color-text-secondary)' }}>
                {formData.displayName?.charAt(0) || 'P'}
              </div>
              <Badge variant={profile?.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
                {profile?.verificationStatus || 'PENDING VERIFICATION'}
              </Badge>
            </div>

            <Input
              label="Display Name (Business or Personal)"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
            
            <Textarea
              label="Bio / About Me"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers about your expertise and commitment to quality..."
            />
            
            <Input
              label="Years of Experience"
              name="experienceYears"
              type="number"
              min="0"
              value={formData.experienceYears}
              onChange={handleChange}
              leftIcon={<Briefcase size={16} />}
            />
          </div>

          <hr style={{ border: 0, borderBottom: '1px solid var(--color-border-subtle)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <DollarSign size={18} color="var(--color-primary)" /> Default Pricing
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Base Hourly Rate"
                name="baseHourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.baseHourlyRate}
                onChange={handleChange}
                leftIcon={<DollarSign size={16} />}
              />
              <Input
                label="Minimum Visit Charge"
                name="minimumVisitCharge"
                type="number"
                min="0"
                step="0.01"
                value={formData.minimumVisitCharge}
                onChange={handleChange}
                leftIcon={<DollarSign size={16} />}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button type="submit" loading={isUpdating}>Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
