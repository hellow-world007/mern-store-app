import React, { Fragment, useContext, useEffect, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceList = (props) => {
  const [wishlist, setWishlist] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const items = location.pathname === "/shop" ? props.products : props.items;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/list/${auth.userId}`
        );
        setWishlist(responseData.products);
      } catch (err) {}
    };
    fetchWishlist();
  }, [sendRequest, auth.userId]);

  const handleToggleLike = async (productId) => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }

    const wishItem = items.find((item) => item.id === productId);

    try {
      const existingItem =
        wishlist && wishlist.find((item) => item.itemId === productId);
      console.log(existingItem);
      if (existingItem) {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/wishlist/${existingItem._id}`,
          "DELETE",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        if (wishlist.length <= 0) {
          return;
        }

        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.itemId !== productId)
        );
        toast("Product removed from wishlist!");
        navigate("/shop");
      } else {
        // const formData = new FormData();
        // formData.append("title", wishItem.title);
        // formData.append("author", wishItem.author);
        // formData.append("category", wishItem.category);
        // formData.append("description", wishItem.description);
        // formData.append("price", wishItem.price);
        // formData.append("stock", wishItem.stock);
        // formData.append("image", wishItem.image);
        // formData.append("productId", wishItem.id);
        // formData.append("userId", auth.userId);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/wishlist`,
          "POST",
          // formData,
          JSON.stringify({
            title: wishItem.title,
            author: wishItem.author,
            category: wishItem.category,
            description: wishItem.description,
            stock: wishItem.stock,
            price: wishItem.price,
            image: wishItem.imageUrl,
            productId: wishItem.id,
            userId: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setWishlist((prevWishlist) => [...prevWishlist, responseData.product]);
        navigate("/shop");
        toast("Product added to wishlist!");
        console.log(responseData);
      }
    } catch (error) {}
  };

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h4>No products found. Maybe create one?</h4>
          <h5>you should be an admin to create product.</h5>
          <Button
            to={`${
              !auth.isLoggedIn ? "/auth" : "/admin-dashboard/upload-product"
            }`}
          >
            Add your favourite product
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <ToastContainer />
      <ul className="placeList">
        {items.map((product) => (
          <PlaceItem
            key={product.id}
            id={product.id}
            image={product.imageUrl}
            title={product.title}
            author={product.author}
            description={product.description}
            category={product.category}
            price={product.price}
            stock={product.stock}
            creatorId={product.creator}
            onDelete={props.onDeletePlace}
            isLiked={
              wishlist && wishlist.find((item) => item.itemId === product.id)
            }
            onToggleLike={handleToggleLike}
          />
        ))}
      </ul>
    </Fragment>
  );
};

export default PlaceList;
