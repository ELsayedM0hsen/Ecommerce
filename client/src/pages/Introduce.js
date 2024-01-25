/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta"; // thay doi tieu de
import Container from "./../components/Container";

const Introduce = () => {
  return (
    <>
      <Meta title="Introduction" />
      <BreadCrumb title="Introduction" />
      <Container class1="contact-wrapper home-wrapper-2 pt-3 pb-4">
        <div className="row">
          <div className="col-12">
            <header className="p-2 bg-primary text-white text-center">
              <h3 className="mb-0">Welcome to our e-commerce website</h3>
            </header>
            <section className="container my-4 contact-item">
              <h2>Introduction</h2>
              <p className="mb-0">
                We are proud to introduce a unique e-commerce website unique
                place where you can discover and shop for smart products for the
                House. With diversity and richness, we deliver giving you a
                great shopping experience, helping to improve your life live
                every day.
              </p>
            </section>
            <section className="container my-4 contact-item">
              <h2>Smart Devices for the Home</h2>
              <p>
                Our website offers a wide range of pine products intelligence,
                including:
              </p>
              <ul>
                <li>
                  Advanced air purifier to improve air quality in your house.
                </li>
                <li>Modern fans help cool the living spac.</li>
                <li>
                  Smart lights can adjust brightness and color as desired want.
                </li>
                <li>Projector to create a great entertainment experience.</li>
                <li>
                  Smart home appliances like connected washing machines and
                  refrigerators Internet.
                </li>
                <li>TV Box to turn your home into an entertainment center.</li>
              </ul>
            </section>
            <section className="container my-4 contact-item">
              <h2>Quality and Reliability</h2>
              <p>
                We are committed to providing high quality products from these
                reputable brand. Our reliability ensures that you Always receive
                the best products for your home. We test and evaluate each
                product to ensure they satisfy meets the highest quality
                standards.
              </p>
            </section>
            <section className="container my-4 contact-item">
              <h2>Why Choose Us?</h2>
              <p>
                We understand that you have many options when shopping online
                gland. Why choose us?
              </p>
              <ul>
                <li>
                  Diversity: We offer a wide variety of products so you can find
                  what you need.
                </li>
                <li>
                  Quality: Our products all meet quality standards high quality.
                </li>
                <li>
                  Outstanding Customer Service: Our customer support team We are
                  always ready to help.
                </li>
                <li>
                  Good value: We are committed to providing products with value
                  the best for you.
                </li>
                <li>
                  Satisfies every need: We bring you everything to Make your
                  home smart and comfortable.
                </li>
              </ul>
            </section>
            <section className="container my-4 contact-item">
              <h2>Start Shopping Now</h2>
              <p>
                Don't miss the opportunity to improve your daily life through
                through smart products for the home. Please visit the website us
                and start shopping now!
              </p>
            </section>
            <footer className="p-2 bg-primary text-white text-center">
              <p>Thank you for coming to our e-commerce website I.</p>
              <p className="mb-0">
                Wish you have a wonderful shopping experience!
              </p>
            </footer>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Introduce;
