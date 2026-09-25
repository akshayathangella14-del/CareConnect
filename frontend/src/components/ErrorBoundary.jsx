import { Component } from 'react';
import Alert from './feedback/Alert/Alert';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="error" title="Something went wrong">
          <div style={{ marginBottom: 'var(--space-2)' }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
          </div>
          <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>
            Error: {this.state.error?.toString() || 'Unknown error'}
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
