import { useState, Children, isValidElement, cloneElement } from 'react';
import styles from './Tabs.module.css';

/**
 * Tabs Component
 * 
 * Usage:
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content 1</Tabs.Content>
 *   <Tabs.Content value="tab2">Content 2</Tabs.Content>
 * </Tabs>
 */
export function Tabs({ defaultValue, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`${styles.tabs} ${className}`}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

Tabs.List = function TabsList({ children, activeTab, setActiveTab, className = '' }) {
  return (
    <div className={`${styles.list} ${className}`} role="tablist">
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
};

Tabs.Trigger = function TabsTrigger({ value, children, activeTab, setActiveTab, className = '', disabled }) {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      className={`${styles.trigger} ${isActive ? styles['trigger--active'] : ''} ${className}`}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Tabs.Content = function TabsContent({ value, children, activeTab, className = '' }) {
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={`${styles.content} ${className}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};
