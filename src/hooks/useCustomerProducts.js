import { DUMMY_PRODUCTS } from "@/constants/dummyProducts";
import { customerService } from "@/services";
import { useEffect, useMemo, useState } from "react";

export function useCustomerProducts(search = "") {
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setIsLoadingProducts(true);

      try {
        const response = await customerService.getProducts({ search: search.trim() });
        if (isMounted && response.products?.length) {
          setProducts(response.products);
        } else if (isMounted) {
          setProducts([]);
        }
      } catch {
        if (isMounted) {
          setProducts(DUMMY_PRODUCTS);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [search]);

  return useMemo(
    () => ({
      products,
      isLoadingProducts,
      isUsingFallbackProducts: products === DUMMY_PRODUCTS,
    }),
    [isLoadingProducts, products],
  );
}
