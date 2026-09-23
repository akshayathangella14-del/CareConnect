import React from 'react';
import { Shield, Wrench, FileText, Camera, Navigation, Play, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { Timeline, Badge } from '@/components';

const getIconForEventType = (type) => {
  if (type.includes('CREATE') || type.includes('UNDERSTOOD')) return <FileText size={16} />;
  if (type.includes('QUOTE')) return <FileText size={16} />;
  if (type.includes('EN_ROUTE')) return <Navigation size={16} />;
  if (type.includes('STARTED') || type.includes('IN_PROGRESS')) return <Play size={16} />;
  if (type.includes('COMPLET') || type.includes('ARRIVED')) return <CheckCircle2 size={16} />;
  if (type.includes('EVIDENCE')) return <Camera size={16} />;
  if (type.includes('SCOPE')) return <Wrench size={16} />;
  if (type.includes('DISPUTE')) return <AlertTriangle size={16} />;
  if (type.includes('REVIEW')) return <MessageSquare size={16} />;
  return <Shield size={16} />;
};

const ServiceTraceTimeline = ({ serviceTraceData }) => {
  if (!serviceTraceData || !serviceTraceData.timeline || serviceTraceData.timeline.length === 0) {
    return <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No trace events available.</div>;
  }

  const events = serviceTraceData.timeline.map((event, index) => {
    return {
      id: index,
      title: event.type.replace(/_/g, ' '),
      time: new Date(event.timestamp).toLocaleString(),
      description: event.description,
      icon: getIconForEventType(event.type),
      isActive: index === serviceTraceData.timeline.length - 1, // Highlight the most recent event
      extraContent: event.evidence?.length > 0 ? (
        <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {event.evidence.map((ev, i) => (
            <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px', backgroundColor: 'var(--color-surface-muted)' }}>
               {ev.file?.url ? (
                 <img src={ev.file.url} alt={ev.description} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
               ) : (
                 <div style={{ width: '80px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                   <Camera size={20} />
                 </div>
               )}
            </div>
          ))}
        </div>
      ) : null
    };
  });

  return (
    <div>
      <Timeline events={events} />
      <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Shield size={24} color="var(--color-violet)" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--font-size-body)' }}>Cryptographically Secured</div>
          <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-text-secondary)' }}>
            This service trace acts as an immutable ledger of the transaction. All scope changes, evidence, and status updates are recorded and cannot be altered.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTraceTimeline;
