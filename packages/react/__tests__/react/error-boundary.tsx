import React from 'react';


export class ErrorBoundary extends React.Component<any,any> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error };
    }
  
    componentDidCatch(error: Error, errorInfo: any) {
      // You can also log the error to an error reporting service      
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1 data-testid='errorboundary'>{this.state.error.message}</h1>;
      }
  
      return this.props.children; 
    }
  }