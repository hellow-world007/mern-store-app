import React, { Fragment, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      author: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      stock: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const [updatePlace, setUpdatePlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/${placeId}`
        );

        setUpdatePlace(responseData.product);
        setFormData(
          {
            title: {
              value: responseData.product.title,
              isValid: true,
            },
            description: {
              value: responseData.product.description,
              isValid: true,
            },
            author: {
              value: responseData.product.author,
              isValid: false,
            },
            price: {
              value: responseData.product.price,
              isValid: false,
            },
            category: {
              value: responseData.product.category,
              isValid: false,
            },
            stock: {
              value: responseData.product.stock,
              isValid: false,
            },
            image: {
              value: responseData.product.image,
              isValid: false,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("author", formState.inputs.author.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("stock", formState.inputs.stock.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/${placeId}`,
        "PATCH",
        formData,
        // JSON.stringify({
        //   title: formState.inputs.title.value,
        //   description: formState.inputs.description.value,
        //   author: formState.inputs.author.value,
        //   price: formState.inputs.price.value,
        //   category: formState.inputs.category.value,
        //   stock: formState.inputs.stock.value,
        //   image: formState.inputs.image.value,
        // }),
        {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      navigate("/admin-dashboard/manage-product");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!updatePlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && updatePlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <div className="grid">
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
            <div>
              <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={updatePlace.title}
                initialValid={true}
              />
              <Input
                id="author"
                element="input"
                type="text"
                label="Author/Brand"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid author."
                onInput={inputHandler}
                initialValue={updatePlace.author}
                initialValid={true}
              />
              <Input
                id="price"
                element="input"
                label="Price"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter the price."
                onInput={inputHandler}
                initialValue={updatePlace.price}
                initialValid={true}
              />
            </div>
          </div>
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={updatePlace.description}
            initialValid={true}
          />
          <Input
            id="category"
            element="input"
            label="Category"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter the category."
            onInput={inputHandler}
            initialValue={updatePlace.category}
            initialValid={true}
          />
          <Input
            id="stock"
            element="input"
            label="Stock(In or Out)"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please indicate wheather it's in stock or out stock."
            onInput={inputHandler}
            initialValue={updatePlace.stock}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PRODUCT
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
