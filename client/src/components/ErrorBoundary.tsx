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
          <p className="font-serif text-lg">Something went wrong loading this page.</p>
          <p className="mt-2 font-sans text-sm text-j-slate">Try a hard refresh (Ctrl+Shift+R) or return home.</p>
          <a href="/" className="mt-4 inline-block border-b border-j-offwhite font-sans text-sm">
            Go to homepage
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
