import React from "react";
import AppRouter from "./router/AppRoutes";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        closeButton={false}
        newestOnTop
        pauseOnHover
        transition={Slide}
        toastStyle={{
          background: "transparent",
          boxShadow: "none",
        }}
      />
    </>
  );
}

export default App;