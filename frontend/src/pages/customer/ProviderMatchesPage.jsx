import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Star } from 'lucide-react';
import { useGetMatchesQuery } from '@/features/serviceRequests';
import { Alert, Badge, Button, Card, EmptyState } from '@/components';

function ProviderMatchesPage() {
  const { id } = useParams();
  const { data: matches = [], isLoading, error } = useGetMatchesQuery(id, { skip: !id });

  if (isLoading) {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading provider matches...</div>;
  }

  if (error) {
    return (
      <Alert variant="error" title="Could not load matches">
        {error?.data?.error?.message || 'Please try again after submitting and confirming the service request.'}
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)' }}>Provider Matches</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Ranked verified providers matched to this service request.
          </p>
        </div>
        <Link to={`/service-requests/${id}`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>Back to request</Button>
        </Link>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={28} />}
          title="No eligible providers yet"
          description="Matches appear after the request is submitted and suitable verified providers are available."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {matches.map((match) => {
            const provider = match.provider || {};
            return (
              <Card key={provider._id || match.providerId} padding="md">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-h4)' }}>
                      {provider.displayName || 'Service Provider'}
                    </h3>
                    <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                      {provider.bio || 'Verified CareConnect provider'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <Badge variant="success" size="sm">{match.score ?? 0}% match</Badge>
                    {match.availabilityMatch && <Badge variant="primary" size="sm">Available</Badge>}
                    {match.serviceAreaMatch && <Badge variant="neutral" size="sm">Area match</Badge>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Star size={14} /> Rating: {provider.ratingSummary?.averageRating || 'New'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <MapPin size={14} /> {provider.serviceAreas?.map((area) => area.label || area.city).filter(Boolean).join(', ') || 'Service area available'}
                    </span>
                  </div>

                  {match.matchedSkills?.length > 0 && (
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                      {match.matchedSkills.slice(0, 4).map((skill) => (
                        <Badge key={skill._id || skill.name || skill} variant="neutral" size="sm">
                          {skill.name || skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProviderMatchesPage;
