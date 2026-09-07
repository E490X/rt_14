import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <React.Fragment>
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg"></div>
                <div className="contant_box_404">
                  <h3 className="h2"> Oops! Page not found.</h3>
                  <p className="para-err404">
                    We could not find the page you were looking for. Meanwhile,
                    you may return to
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link to="/dashboard" className="link_404">
          Dashboard
        </Link>
      </section>
    </React.Fragment>
  );
};

export default Error404;
