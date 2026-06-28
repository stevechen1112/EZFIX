import { SiteShell } from "@/components/frontend/SiteShell";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
