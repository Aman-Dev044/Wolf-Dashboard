import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { TrackingForm } from "./TrackingForm";

export const metadata = pageMeta({
  title: "Tracking Package – Order Status",
  description: "Track your Wolf order. Enter your order number and the email address used at checkout to see the latest status.",
  path: "/tracking/",
});

export default function TrackingPage() {
  return (
    <>
      <PageHero title="Tracking Package" text="Enter your order number and the email you used at checkout to see the status of your order." crumbs={[{ name: "Tracking Package", path: "/tracking/" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="container-wolf max-w-3xl">
          <TrackingForm />
        </div>
      </section>
    </>
  );
}
