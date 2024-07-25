import React, { Fragment, useContext, useState } from "react";

import { Navigate, redirect, useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import { MdOutlineShoppingCart } from "react-icons/md";

const Auth = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [uType, setUtype] = useState("");
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          key: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
          key: {
            value: "",
            isValid: true,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (uType === "") {
      alert("Please provide user type");
      return;
    }

    if (isLoginMode) {
      try {
        if (!!formState.inputs.key) {
          if (formState.inputs.key.value !== process.env.REACT_APP_SECRET_KEY) {
            alert("Please provide the correct secret key");
            return;
          }
        }

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            userType: uType,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        login(responseData.userId, responseData.token, responseData.userType);
        redirect("/");
      } catch (err) {}
    } else {
      try {
        if (!!formState.inputs.key.value) {
          if (formState.inputs.key.value !== process.env.REACT_APP_SECRET_KEY) {
            alert("Please provide the correct secret key");
            return;
          }
        }

        // Remember, formData is needed for image.
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("userType", uType);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
          "POST",
          formData
          // JSON.stringify({
          //   name: formState.inputs.name.value,
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value,
          //   image: formState.inputs.image.value,
          //   userType: uType,
          // }),
          // {
          //   "Content-Type": "application/json",
          // }
        );
        login(responseData.userId, responseData.token, responseData.userType);
        navigate("/");
      } catch (err) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <section className="auth">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoggedIn && <Navigate to="/" replace={true} />}
        <div className="logo">
          <MdOutlineShoppingCart />
          <h4>Mern Store</h4>
        </div>
        <p className="title">
          {isLoginMode ? "Sign in" : "Create your account"}
        </p>
        <p className="text">to continue to Mern Store</p>
        <form onSubmit={authSubmitHandler}>
          <div className="radio-container">
            <h4>{!isLoginMode ? "Register as" : "Login as"}</h4>
            <div>
              <input
                type="radio"
                id="option1"
                name="userType"
                value="User"
                checked={uType === "User"}
                onChange={(e) => setUtype(e.target.value)}
              />
              <label htmlFor="option1" className="radio-label">
                User
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="option2"
                name="userType"
                value="Admin"
                checked={uType === "Admin"}
                onChange={(e) => setUtype(e.target.value)}
              />
              <label htmlFor="option2" className="radio-label">
                Admin
              </label>
            </div>
          </div>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {uType === "Admin" && (
            <Input
              element="input"
              id="key"
              type="text"
              label="Secret Key"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a secret key to authenticate as admin."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <div className="formFooter">
            <p>
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <p className="span" onClick={switchModeHandler}>
              {isLoginMode ? "Register" : "Login"}
            </p>
          </div>
        </form>
      </section>
    </Fragment>
  );
};

export default Auth;
