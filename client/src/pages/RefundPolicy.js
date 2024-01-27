import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";

const RefundPolicy = () => {
  return (
    <>
      <Meta title="Refund Policy" />
      <BreadCrumb title="Refund Policy" />
      <Container class1="policy-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <h2>Refund Policy</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              aliquet, justo id blandit tristique, sem sapien varius leo, at
              volutpat nibh justo at neque. Nulla facilisi. Morbi aliquet turpis
              eu justo laoreet, sed tempus tortor mollis. In et libero nisl.
              Proin convallis eros eu neque tincidunt, vel feugiat nisi
              suscipit. Duis vestibulum ligula vel nisi vehicula hendrerit.
              Quisque congue convallis nunc at venenatis.
            </p>
            <p>
              Praesent convallis, magna non mattis tristique, leo orci congue
              nulla, at tempor velit odio non nunc. Integer dictum, sem sed
              viverra iaculis, libero tortor venenatis dui, id lobortis orci
              ipsum sit amet ipsum. Sed sed lacinia turpis. Duis feugiat
              lobortis lectus vel auctor. Nullam scelerisque ut lectus ac
              auctor. Sed nec interdum libero. Integer vitae congue lorem. Cras
              nec blandit dolor, ac blandit dui. Aenean varius hendrerit ipsum,
              vel ultricies purus cursus eget.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RefundPolicy;
