import React, { useEffect, useState } from "react";
import "./CategoryPopup.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Link } from "react-router-dom";

const CategoryPopup = ({ onClose }) => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`
        );

        setLoadedPlaces(responseData.products);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const uniqueCategories = loadedPlaces ? Array.from(new Set(loadedPlaces.map(item => item.category))) : [];

  return (
    <div className="popup">
      <div className="titles">Filter By Category</div>
      <hr />
      <ul>
        {uniqueCategories.map((category, index) => (
          <Link
            to={`/shop/category/${category}`}
            key={index}
            onClick={() => onClose()}
          >
            {category}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPopup;
