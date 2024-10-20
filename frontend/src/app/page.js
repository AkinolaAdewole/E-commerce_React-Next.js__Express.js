"use client";

import CategoryList from "../components/CategoryList";
import ProductList from "../components/ProductList";
import Skeleton from "../components/Skeleton";
import Slider from "../components/Slider";
import { Suspense, useEffect, useState } from "react";
import { useWixClient } from "../hooks/useWixClient";

const HomePage = () => {
  const wixClient = useWixClient();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await wixClient.products.queryProducts().find();
        console.log("Products fetched: ", res);
        setProducts(res.items || []); // Assuming res contains an `items` array
      } catch (err) {
        console.error("Error fetching products: ", err);
        setError("Failed to fetch products.");
      }
    };

    if (wixClient) {
      getProducts();
    }
  }, [wixClient]);

  return (
    <div className="">
      <Slider />
      
      {/* Featured Products Section */}
      {/* <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID}
            limit={4}
          />
        </Suspense>
      </div> */}

      {/* Uncomment if you want to display categories */}
      {/* 
      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div> 
      */}

      {/* New Products Section */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_NEW_CATEGORY_ID}
            limit={4}
          />
        </Suspense>
      </div>

      {/* Error Handling */}
      {/* {error && <div className="text-red-500 mt-4">{error}</div>} */}
    </div>
  );
};

export default HomePage;
