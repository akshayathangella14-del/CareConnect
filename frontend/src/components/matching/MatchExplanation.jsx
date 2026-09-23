import React from 'react';
import { Check, X, MapPin, Calendar, Award, Star, Briefcase } from 'lucide-react';
import Badge from '../ui/Badge/Badge';

const MatchExplanationItem = ({ icon: Icon, title, description, isMatch, highlight }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
    <div style={{ 
      color: isMatch ? 'var(--color-success)' : 'var(--color-text-muted)',
      backgroundColor: isMatch ? 'var(--color-success-soft)' : 'var(--color-surface-muted)',
      padding: 'var(--space-2)',
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={16} />
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-small)' }}>{title}</div>
        {highlight && <Badge variant="primary" size="sm">{highlight}</Badge>}
      </div>
      <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
        {description}
      </div>
    </div>
  </div>
);

const MatchExplanation = ({ explanation }) => {
  const {
    matchedSkills = [],
    serviceAreaMatch,
    availabilityMatch,
    experienceYears,
    ratingSummary,
    completedJobs
  } = explanation || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <MatchExplanationItem
        icon={Award}
        title="Skills Match"
        description={`Matches ${matchedSkills.length} required skills for this job.`}
        isMatch={matchedSkills.length > 0}
        highlight={matchedSkills.length > 0 ? `${matchedSkills.length} Skills` : null}
      />
      
      <MatchExplanationItem
        icon={MapPin}
        title="Service Area"
        description={serviceAreaMatch ? "Operates in your requested location." : "Does not typically operate in your location."}
        isMatch={serviceAreaMatch}
      />
      
      <MatchExplanationItem
        icon={Calendar}
        title="Availability"
        description={availabilityMatch ? "Available during your preferred schedule." : "May require schedule negotiation."}
        isMatch={availabilityMatch}
      />
      
      <MatchExplanationItem
        icon={Briefcase}
        title="Experience"
        description={`${experienceYears} years of experience and ${completedJobs} completed jobs on the platform.`}
        isMatch={experienceYears > 0 || completedJobs > 0}
        highlight={`${experienceYears} Yrs`}
      />
      
      <MatchExplanationItem
        icon={Star}
        title="Rating"
        description={`${ratingSummary?.averageRating?.toFixed(1) || '0.0'} average rating across ${ratingSummary?.reviewCount || 0} reviews.`}
        isMatch={ratingSummary?.averageRating >= 4.0}
      />
    </div>
  );
};

export default MatchExplanation;
