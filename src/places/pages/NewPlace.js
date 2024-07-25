import React, { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const [formState, inputHandler] = useForm(
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
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const placeSubmitHandler = async (event) => {
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
      // we now take the userId from the auth status for more sequrity issues.

      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/create-product`,
        "POST",
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
        },
      );
      navigate("/shop");
      console.log(responseData);
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onCancel={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
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
            />
            <Input
              id="author"
              element="input"
              type="text"
              label="Author/Brand"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid author."
              onInput={inputHandler}
            />
            <Input
              id="price"
              element="input"
              label="Price"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter the price."
              onInput={inputHandler}
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
        />
        <Input
          id="category"
          element="input"
          label="Category"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter the category."
          onInput={inputHandler}
        />
        <Input
          id="stock"
          element="input"
          label="Stock(In or Out)"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please indicate wheather it's in stock or out stock."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PRODUCT
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
