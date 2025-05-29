// src/components/ErrorBoundary.jsx - ENHANCED VERSION
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('❌ ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Store error info in state
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-700 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={this.handleReload}
                className="w-full bg-[#8A6552] text-white px-6 py-3 rounded-lg hover:bg-[#7A5A47] transition-colors font-medium"
              >
                🔄 Reload Page
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                🏠 Go to Home
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-sm text-gray-500">
              <p>If the problem persists, please contact support at</p>
              <a 
                href="mailto:support@evendiona.com" 
                className="text-[#8A6552] hover:underline"
              >
                support@evendiona.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
