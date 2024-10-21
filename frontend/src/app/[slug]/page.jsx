
import Add from '../../components/Add';
import CustomizeProducts from "../../components/CustomizeProducts";
import ProductImages from "../../components/ProductImages";
import Reviews from "../../components/Reviews";
import { notFound } from "next/navigation";
import { Suspense, useEffect } from "react";
import axios from 'axios';


const fetchProductData = async (id) => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching product: ", err);
    return null;
  }
};



const SinglePage = async ({ params }) => {
  const product = await fetchProductData(params.slug); 

  if (!product) {
    return notFound();
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* Product Images */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={[{ image: { url: product.image } }]} /> 
      </div>

      
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.title}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />
        <h2 className="font-medium text-2xl">${product.price}</h2>
        <div className="h-[2px] bg-gray-100" />
        
        
        <Add
          productId={product.id} 
          variantId="00000000-0000-0000-0000-000000000000"
          stockNumber={product.rating?.count || 0} 
        />
        
        <div className="h-[2px] bg-gray-100" />
        
        {/* User Reviews */}
        <h1 className="text-2xl">User Reviews</h1>
        <Suspense fallback="Loading...">
          <Reviews productId={product.id} /> 
        </Suspense>
      </div>
    </div>
  );
};

export default SinglePage;
