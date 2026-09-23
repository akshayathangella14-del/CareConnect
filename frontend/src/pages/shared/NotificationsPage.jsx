import { useState } from 'react';
import { useListNotificationsQuery, useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation } from '@/features/notifications';
import { Card, Button, Badge, EmptyState } from '@/components';
import { Bell, Check, CheckCircle2, MessageSquare, AlertTriangle, Info, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useListNotificationsQuery();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const handleMarkAll = async () => {
    try {
      await markAllRead().unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'INFO': return <Info size={20} color="var(--color-info)" />;
      case 'SUCCESS': return <CheckCircle2 size={20} color="var(--color-success)" />;
      case 'WARNING': return <AlertTriangle size={20} color="var(--color-warning)" />;
      case 'ERROR': return <AlertTriangle size={20} color="var(--color-error)" />;
      default: return <Bell size={20} color="var(--color-text-muted)" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <BellRing size={28} color="var(--color-primary)" /> Notifications
            {unreadCount > 0 && <Badge variant="primary">{unreadCount} New</Badge>}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Stay updated on your quotes, bookings, and platform alerts.</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAll} loading={isMarkingAll} leftIcon={<Check size={16}/>}>
            Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={48} />}
          title="All caught up!"
          description="You have no new notifications."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {notifications.map(notification => (
            <Card 
              key={notification._id} 
              style={{ 
                borderLeft: notification.isRead ? '4px solid transparent' : '4px solid var(--color-primary)',
                backgroundColor: notification.isRead ? 'var(--color-surface)' : 'var(--color-surface-muted)',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (!notification.isRead) markRead(notification._id);
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {getIconForType(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-1)' }}>
                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-body)', fontWeight: notification.isRead ? 500 : 600 }}>
                      {notification.title}
                    </h4>
                    <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', marginLeft: 'var(--space-2)' }}>
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                    {notification.message}
                  </p>
                  
                  {notification.linkUrl && (
                    <div style={{ marginTop: 'var(--space-2)' }} onClick={(e) => e.stopPropagation()}>
                      <Link to={notification.linkUrl} style={{ fontSize: 'var(--font-size-caption)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                        View Details →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}