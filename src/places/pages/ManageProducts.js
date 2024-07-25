import React, { useEffect, useState } from "react";

// import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import PlaceItemAdmin from "../components/PlaceItemAdmin";

const ManageProducts = () => {
  const [loadedProducts, setLoadedProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`
        );

        setLoadedProducts(responseData.products);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedProducts((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && (
        <div>
          <Container>
            <Form>
              <InputGroup className="my-3">
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users"
                />
              </InputGroup>
            </Form>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Stock</th>
                  <th>Product Id</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {loadedProducts
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.name.toLowerCase().includes(search);
                  })
                  .map((item, index) => (
                    <PlaceItemAdmin
                      key={item.id}
                      id={item.id}
                      image={item.imageUrl}
                      title={item.title}
                      author={item.author}
                      description={item.description}
                      category={item.category}
                      price={item.price}
                      stock={item.stock}
                      creatorId={item.creator}
                      onDelete={placeDeletedHandler}
                    />
                  ))}
              </tbody>
            </Table>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default ManageProducts;
