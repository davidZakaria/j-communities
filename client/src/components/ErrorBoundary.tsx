import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-j-black px-6 py-16 text-j-offwhite">
          <p className="font-serif text-lg">Something went wrong.</p>
          <button
            type="button"
            className="mt-4 border-b border-j-offwhite font-sans text-sm"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
