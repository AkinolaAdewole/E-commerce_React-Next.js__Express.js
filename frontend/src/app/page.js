"use client";

import CategoryList from "../components/CategoryList";
import ProductList from "../components/ProductList";
import Skeleton from "../components/Skeleton";
import Slider from "../components/Slider";
import { Suspense, useEffect, useState } from "react";
import axios from "axios"; // Axios for making API calls

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        // console.log("Products fetched: ", res.data);
        // setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products: ", err);
        setError("Failed to fetch products.");
      }
    };

    getProducts(); // Fetch products when component mounts
  }, []);

  return (
    <div className="">
      <Slider />

      {/* Featured Products Section */}
      {/* <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Skeleton />}>
          <ProductList
            products={products.slice(0, 4)} // Display the first 4 products
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
            products={products.slice(0, 4)} // Display the first 4 products
          />
        </Suspense>
      </div>

      {/* Error Handling */}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default HomePage;
