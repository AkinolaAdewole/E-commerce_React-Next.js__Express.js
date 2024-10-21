"use client"; // This ensures it's treated as a client component

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ items }) => {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div>
      <div className="h-[500px] relative">
        {items[index]?.image ? ( // Safely access image
          <Image
            src={items[index].image.url}
            alt=""
            fill
            sizes="50vw"
            className="object-cover rounded-md"
          />
        ) : (
          <div>No image available.</div>
        )}
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item, i) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={item._id}
            onClick={() => setIndex(i)}
          >
            {item.image ? (
              <Image
                src={item.image.url}
                alt=""
                fill
                sizes="30vw"
                className="object-cover rounded-md"
              />
            ) : (
              <div>No image available.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
