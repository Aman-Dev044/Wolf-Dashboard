import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { WishlistView } from "./WishlistView";

export const metadata = pageMeta({ title: "Wishlist", path: "/wishlist/", noindex: true });

export default function WishlistPage() {
  return (
    <>
      <PageHero title="Wishlist" crumbs={[{ name: "Wishlist", path: "/wishlist/" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="container-wolf">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
