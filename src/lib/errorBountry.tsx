import React, { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}    

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error or handle it in any other way
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return <h1>Something went wrong.</h1>;
    }

    // Render the child components if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
