import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { AccountView } from "./AccountView";

export const metadata = pageMeta({ title: "My account", path: "/my-account/", noindex: true });

export default function AccountPage() {
  return (
    <>
      <PageHero title="My account" crumbs={[{ name: "My account", path: "/my-account/" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="container-wolf">
          <Suspense>
            <AccountView />
          </Suspense>
        </div>
      </section>
    </>
  );
}
