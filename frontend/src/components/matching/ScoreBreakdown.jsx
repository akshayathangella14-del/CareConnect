import React from 'react';

const ScoreBreakdown = ({ score }) => {
  // Assuming a max score of 100 for simplicity in the UI, though it could technically go higher.
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  let color = 'var(--color-primary)';
  if (normalizedScore >= 80) color = 'var(--color-success)';
  else if (normalizedScore < 50) color = 'var(--color-warning)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div 
        style={{ 
          fontSize: 'var(--font-size-h3)', 
          fontWeight: 700, 
          color 
        }}
      >
        {score}
      </div>
      <div style={{ flex: 1, minWidth: '60px' }}>
        <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Match Score</div>
        <div 
          style={{
            height: '6px',
            backgroundColor: 'var(--color-surface-muted)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${normalizedScore}%`,
              backgroundColor: color,
              transition: 'width 0.3s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;
