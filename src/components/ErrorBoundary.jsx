import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>Something went wrong.</h1>
          <p>Please refresh the page. If the problem continues, contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}