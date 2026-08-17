"use client";

// Catches errors in the root layout itself — error.tsx can't (it renders
// inside the layout, so a layout-level crash would take it down too).
// Has to define its own <html>/<body> since it replaces the root layout
// entirely when triggered. Deliberately minimal/inline-styled: this is
// the one screen that must render even if the design-system CSS itself
// is implicated in the crash.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#000",
          color: "#F9F9F9",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
          Something broke.
        </h1>
        <p style={{ marginTop: "1rem", color: "#A7A7A7", maxWidth: 380 }}>
          Refresh, or try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "2rem",
            background: "#E85002",
            color: "#000",
            border: "none",
            borderRadius: 9999,
            padding: "0.875rem 1.75rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
