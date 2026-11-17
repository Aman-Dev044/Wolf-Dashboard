import { PageTransition } from "@/components/parallax";

/** Templates remount on every navigation, so each new page eases in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
