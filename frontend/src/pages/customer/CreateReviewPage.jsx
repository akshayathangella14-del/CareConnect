import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCreateReviewMutation } from '@/features/reviews';
import { Card, Button, Textarea, Alert } from '@/components';
import { Star } from 'lucide-react';

export default function CreateReviewPage() {
  const navigate = useNavigate();
  const { bookingId: routeBookingId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = routeBookingId || searchParams.get('bookingId');
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId) return;

    try {
      await createReview({ booking: bookingId, ...formData }).unwrap();
      navigate('/bookings');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Write a Review</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Share your experience with this service provider.
        </p>
      </div>

      <Card padding="lg">
        {!bookingId && (
          <Alert variant="error" title="Missing booking">
            Open this review form from a completed booking so the booking can be attached.
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-small)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Star
                    size={32}
                    fill={star <= formData.rating ? 'currentColor' : 'none'}
                    color={star <= formData.rating ? 'var(--color-warning)' : 'var(--color-border)'}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Your Comments"
            name="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            placeholder="Tell us about your experience..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => navigate(-1)} type="button">Cancel</Button>
            <Button type="submit" loading={isLoading} disabled={!bookingId}>Submit Review</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
