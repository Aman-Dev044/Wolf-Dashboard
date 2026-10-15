import { getSite } from "@/lib/api";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = pageMeta({ title: "Checkout", path: "/checkout/", noindex: true });

export default async function CheckoutPage() {
  const site = await getSite();
  return (
    <>
      <PageHero title="Checkout" crumbs={[{ name: "Cart", path: "/cart/" }, { name: "Checkout", path: "/checkout/" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="container-wolf">
          <CheckoutForm stores={site.stores} notice={site.deliveryNotice} />
        </div>
      </section>
    </>
  );
}
