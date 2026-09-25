import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeProviderQuery, useUpdateMeProviderMutation } from '@/features/providers';
import { useListSkillsQuery } from '@/features/skills/skillApi';
import { selectCurrentUser, updateUser, useUpdateProfileImageMutation } from '@/features/auth';
import { Card, Input, Textarea, Button, Alert, Badge } from '@/components';
import { User, MapPin, DollarSign, Briefcase, Plus, X, Wrench, Camera } from 'lucide-react';

export default function ProviderProfilePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: profile, isLoading } = useGetMeProviderQuery();
  const [updateProfile, { isLoading: isUpdating, error: updateError, isSuccess }] = useUpdateMeProviderMutation();
  const [uploadProfileImage, { isLoading: isUploading, error: uploadError }] = useUpdateProfileImageMutation();
  const { data: availableSkills = [], isLoading: isLoadingSkills } = useListSkillsQuery();

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    experienceYears: '',
    baseHourlyRate: '',
    minimumVisitCharge: '',
    selectedSkills: [],
    serviceAreas: []
  });

  const [newArea, setNewArea] = useState({ label: '', city: '', state: '', postalCode: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        experienceYears: profile.experienceYears || '',
        baseHourlyRate: profile.pricing?.baseHourlyRate || '',
        minimumVisitCharge: profile.pricing?.minimumVisitCharge || '',
        selectedSkills: profile.skills?.map(s => typeof s === 'object' ? s._id : s) || [],
        serviceAreas: profile.serviceAreas || []
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => {
      const skills = prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...prev.selectedSkills, skillId];
      return { ...prev, selectedSkills: skills };
    });
  };

  const handleAddArea = () => {
    if (newArea.city && newArea.state) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, { ...newArea, label: newArea.label || newArea.city }]
      }));
      setNewArea({ label: '', city: '', state: '', postalCode: '' });
    }
  };

  const handleRemoveArea = (index) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        experienceYears: Number(formData.experienceYears),
        skills: formData.selectedSkills,
        serviceAreas: formData.serviceAreas,
        pricing: {
          currency: 'INR',
          baseHourlyRate: Number(formData.baseHourlyRate),
          minimumVisitCharge: Number(formData.minimumVisitCharge)
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await uploadProfileImage(formData).unwrap();
      dispatch(updateUser(result.user));
    } catch (error) {
      console.error('Failed to upload provider photo:', error);
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

      {uploadError && (
        <Alert variant="error" title="Image upload failed">
          {uploadError.data?.error?.message || 'Unable to upload your profile image.'}
        </Alert>
      )}

      <Card padding="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={18} color="var(--color-primary)" /> Basic Information
            </h3>
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-surface-muted)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-h2)', color: 'var(--color-text-secondary)' }}>
                {currentUser?.profileImage ? <img src={currentUser.profileImage} alt={formData.displayName || 'Provider'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (formData.displayName?.charAt(0) || 'P')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Badge variant={profile?.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}>
                  {profile?.verificationStatus || 'PENDING VERIFICATION'}
                </Badge>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600 }}>
                  <Camera size={16} /> Update photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
              </div>
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

          {/* Skills Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Wrench size={18} color="var(--color-primary)" /> Services & Skills
            </h3>
            
            {isLoadingSkills ? (
              <div>Loading skills...</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {availableSkills.map(skill => (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => toggleSkill(skill._id)}
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      border: formData.selectedSkills.includes(skill._id) ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: formData.selectedSkills.includes(skill._id) ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                      color: formData.selectedSkills.includes(skill._id) ? 'var(--color-primary)' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-small)'
                    }}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <hr style={{ border: 0, borderBottom: '1px solid var(--color-border-subtle)' }} />

          {/* Service Areas Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={18} color="var(--color-primary)" /> Service Areas
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {formData.serviceAreas.map((area, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-small)' }}>{area.city}, {area.state}</span>
                  <button type="button" onClick={() => handleRemoveArea(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 'var(--space-2)', alignItems: 'end' }}>
              <Input
                label="City"
                value={newArea.city}
                onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                placeholder="Mumbai"
              />
              <Input
                label="State"
                value={newArea.state}
                onChange={(e) => setNewArea({ ...newArea, state: e.target.value })}
                placeholder="Maharashtra"
              />
              <Input
                label="Postal Code"
                value={newArea.postalCode}
                onChange={(e) => setNewArea({ ...newArea, postalCode: e.target.value })}
                placeholder="400001"
              />
              <Button type="button" onClick={handleAddArea} disabled={!newArea.city || !newArea.state} style={{ height: 40 }}>
                <Plus size={16} /> Add Area
              </Button>
            </div>
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
            <Button type="submit" loading={isUpdating || isUploading}>Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
