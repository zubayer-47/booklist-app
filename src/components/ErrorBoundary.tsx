// ErrorBoundary.tsx

import React from "react";
import Error from "./Error";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to indicate an error has occurred
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught in Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log(this.state.error, "error from ErrorBoundary");
      // Fallback UI
      return (
        <div className="flex flex-col gap-5">
          <Navbar />
          <div className="container">
            <Error
              error={this.state.error?.message || "Something went wrong"}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
