import React from 'react'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "App";
import store from './store/index'
import "assets/scss/style.scss";
import "assets/css/custom.css"
// ==============================|| REACT DOM RENDER  ||============================== //
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  </React.StrictMode>
)
