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
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="error" title="Something went wrong">
          {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
