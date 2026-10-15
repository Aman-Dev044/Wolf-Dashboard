import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CartView } from "@/components/CartView";

export const metadata = pageMeta({ title: "Cart", path: "/cart/", noindex: true });

export default function CartPage() {
  return (
    <>
      <PageHero title="Cart" crumbs={[{ name: "Cart", path: "/cart/" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="container-wolf">
          <CartView />
        </div>
      </section>
    </>
  );
}
