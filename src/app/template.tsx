/**
 * Next.js templates remount on every navigation (unlike layouts).
 * That guarantees WordPress client islands tear down and re-init when
 * soft-navigating between pages that share the same route segment.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}
