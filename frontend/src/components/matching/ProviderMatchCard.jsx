import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, ShieldCheck } from 'lucide-react';
import Card from '../ui/Card/Card';
import Button from '../ui/Button/Button';
import Badge from '../ui/Badge/Badge';
import ScoreBreakdown from './ScoreBreakdown';
import MatchExplanation from './MatchExplanation';

const ProviderMatchCard = ({ match, onRequestQuote, isRequesting }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { provider, score, explanation } = match;

  return (
    <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header Info & Score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div 
            style={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-h3)',
              color: 'var(--color-text-muted)',
              border: '2px solid var(--color-border)'
            }}
          >
            {provider.displayName?.charAt(0)?.toUpperCase() || provider.user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-h4)' }}>{provider.displayName || provider.user?.name}</h3>
              {provider.verificationStatus === 'VERIFIED' && (
                <ShieldCheck size={18} color="var(--color-primary)" title="Verified Provider" />
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} color="var(--color-warning)" /> 
                {provider.ratingSummary?.averageRating?.toFixed(1) || '0.0'} ({provider.ratingSummary?.reviewCount || 0} reviews)
              </span>
              <span>•</span>
              <span>{provider.experienceYears || 0} Years Exp.</span>
            </div>
          </div>
        </div>
        
        <div style={{ minWidth: '150px' }}>
          <ScoreBreakdown score={score} />
        </div>
      </div>

      {/* Primary Actions & Skills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Top Skills</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {provider.skills?.slice(0, 3).map((skill, idx) => (
              <Badge key={skill._id || idx} variant="neutral" size="sm">{skill.name}</Badge>
            ))}
            {provider.skills?.length > 3 && (
              <Badge variant="neutral" size="sm">+{provider.skills.length - 3} more</Badge>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            rightIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          >
            {isExpanded ? 'Hide Details' : 'Why it matches'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onRequestQuote(provider._id)}
            loading={isRequesting}
          >
            Request Quote
          </Button>
        </div>
      </div>

      {/* Expanded Match Explanation */}
      {isExpanded && (
        <div style={{ 
          marginTop: 'var(--space-2)', 
          paddingTop: 'var(--space-4)', 
          borderTop: '1px solid var(--color-border)' 
        }}>
          <h4 style={{ fontSize: 'var(--font-size-small)', marginBottom: 'var(--space-3)' }}>Match Analysis</h4>
          <MatchExplanation explanation={explanation} />
          
          {provider.bio && (
            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Provider Bio</div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {provider.bio}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ProviderMatchCard;
