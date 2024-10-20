import Pagination from "./Pagination";

// Fetch categories from the API at build time
export async function getStaticProps() {
  let categories = [];
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    categories = await res.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
  }

  return {
    props: {
      categories,
    },
    revalidate: 10, // Optional: revalidate every 10 seconds
  };
}

const CategoryList = ({ categories }) => {
  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))
        ) : (
          <li>No categories found.</li>
        )}
      </ul>
      <Pagination currentPage={0} hasPrev={false} hasNext={false} />
    </div>
  );
};

export default CategoryList;




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
