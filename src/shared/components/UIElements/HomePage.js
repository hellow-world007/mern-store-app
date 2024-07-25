import React from "react";
import "./HomePage.css";
import CarouselPage from "./Carousel";
import Button from "../FormElements/Button";

const HomePage = () => {
  return (
    <div className="home-pages">
      <div className="coursel">
        <CarouselPage />
      </div>
      <main>
        <section className="section">
          <div>
            <div className="hero">
              <h1>MERN E-Commerce Store</h1>
              <p>Taste & share food from all over the world.</p>
            </div>
            <div className="cta">
              <Button inverse to="/auth">
                Join Our Community
              </Button>
              <Button to="/shop">Explore Store</Button>
            </div>
          </div>
        </section>
        <section className="section">
          <h2>How it works</h2>
          <p>
            MERN Store is a platform for peoples to share their favorite
            products with the world. It&apos;s a place to discover new products,
            and to connect with others.
          </p>
          <p>
            You can create your own account to sell or purchase products. You
            can manage your account, your customers etc.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
