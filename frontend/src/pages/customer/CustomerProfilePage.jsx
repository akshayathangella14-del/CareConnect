import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Mail, Phone, Save, UserRound } from 'lucide-react';
import { Card, Input, Button, Alert } from '@/components';
import { selectCurrentUser, updateUser, useGetMeQuery, useUpdateMeMutation, useUpdateProfileImageMutation } from '@/features/auth';

export default function CustomerProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data: meData } = useGetMeQuery(undefined, { skip: !user });
  const [updateMe, { isLoading: isSaving, error: saveError, isSuccess: saveSuccess }] = useUpdateMeMutation();
  const [uploadProfileImage, { isLoading: isUploading, error: uploadError }] = useUpdateProfileImageMutation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const activeUser = meData?.user || user;
    if (activeUser) {
      setFormData({
        name: activeUser.name || '',
        phone: activeUser.phone || '',
      });
    }
  }, [meData, user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await uploadProfileImage(formData).unwrap();
      dispatch(updateUser(result.user));
    } catch (error) {
      console.error('Failed to upload profile image:', error);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      const result = await updateMe({
        name: formData.name,
        phone: formData.phone,
      }).unwrap();

      dispatch(updateUser(result.user));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const profileImage = user?.profileImage || meData?.user?.profileImage;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>My profile</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Keep your personal details current and add a profile image for a more trusted booking experience.</p>
      </div>

      {saveSuccess && (
        <Alert variant="success" title="Profile saved">Your contact details were updated successfully.</Alert>
      )}

      {saveError && (
        <Alert variant="error" title="Save failed">{saveError?.data?.error?.message || 'Unable to update your profile.'}</Alert>
      )}

      {uploadError && (
        <Alert variant="error" title="Image upload failed">{uploadError?.data?.error?.message || 'We could not upload your image.'}</Alert>
      )}

      <Card padding="lg">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', overflow: 'hidden', position: 'relative', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 'var(--font-size-h3)', fontWeight: 700 }}>
              {profileImage ? <img src={profileImage} alt={user?.name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserRound size={36} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{user?.name || 'Your profile'}</div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600 }}>
                <Camera size={16} />
                Upload photo
                <input type="file" accept="image/*" onChange={handleProfileUpload} hidden />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Full name" name="name" value={formData.name} onChange={handleInputChange} leftIcon={<UserRound size={16} />} />
            <Input label="Phone number" name="phone" value={formData.phone} onChange={handleInputChange} leftIcon={<Phone size={16} />} />
          </div>

          <Input label="Email" value={user?.email || ''} leftIcon={<Mail size={16} />} disabled />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={isSaving || isUploading}>
              <Save size={16} /> Save profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
