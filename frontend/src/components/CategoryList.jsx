// import { useEffect, useState } from "react";
// import Pagination from "./Pagination";

// const CategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch categories from a public API or your chosen data source
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("https://fakestoreapi.com/products/categories");
//         const data = await res.json();
//         setCategories(data);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Categories</h1>
//       <ul>
//         {categories.map((category, index) => (
//           <li key={index}>{category}</li>
//         ))}
//       </ul>
//       <Pagination currentPage={0} hasPrev={false} hasNext={false} />
//     </div>
//   );
// };

// export default CategoryList;



// import { useEffect, useState } from "react";
// import { wixClientServer } from "../lib/wixClientServer";
// import Image from "next/image";
// import Link from "next/link";

// const CategoryList = () => {
//   const [cats, setCats] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const wixClient = await wixClientServer();
//       const response = await wixClient.collections.queryCollections().find();
//       setCats(response.items);
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="px-4 overflow-x-scroll scrollbar-hide">
//       <div className="flex gap-4 md:gap-8">
//         {cats.map((item) => (
//           <Link
//             href={`/list?cat=${item.slug}`}
//             className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
//             key={item._id}
//           >
//             <div className="relative bg-slate-100 w-full h-96">
//               <Image
//                 src={item.media?.mainMedia?.image?.url || "/cat.png"}
//                 alt={item.name}
//                 fill
//                 sizes="20vw"
//                 className="object-cover"
//               />
//             </div>
//             <h1 className="mt-8 font-light text-xl tracking-wide">
//               {item.name}
//             </h1>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryList;
