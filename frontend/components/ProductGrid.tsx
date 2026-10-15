import { ProductCard } from "./ProductCard";
import { Stagger, StaggerItem } from "./motion";
import type { Product } from "@/lib/types";

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 | 5 }) {
  const cols = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-4 xl:grid-cols-5" }[columns];
  return (
    <Stagger as="ul" className={`grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-[30px] ${cols}`}>
      {products.map((p, i) => (
        <StaggerItem as="li" key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
