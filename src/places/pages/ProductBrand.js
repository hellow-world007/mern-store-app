import React, { useEffect, useState } from "react";
import "./filter.css";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const ProductBrand = () => {
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

  const uniqueAuthors = loadedPlaces ? Array.from(new Set(loadedPlaces.map(item => item.author))) : [];

  const uniqueProducts = loadedPlaces
    ? uniqueAuthors.map(author => loadedPlaces.find(product => product.author === author))
    : [];

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="product-brand">
      <div className="title">Shop By Brand</div>
      <div className="brandsEl">
        {uniqueProducts.map((product, index) => (
          <Link to={`/shop/brands/${product.author}`} key={index}>
            <article className="brand-items">
              <p className="brand-name">{product.author}</p>
              <p className="brand-description">{product.description}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductBrand;
