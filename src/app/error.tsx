"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="kosick-native-page" style={{ padding: "4rem 1.5rem" }}>
      <h1 className="page-title">This page is temporarily unavailable</h1>
      <p className="body-text">
        The content service did not respond. Other pages on the site are unaffected.
      </p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
