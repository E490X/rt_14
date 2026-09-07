import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./Routes";
import MainLayout from "layout/MainLayout";
import { useSelector } from "react-redux";
import Error404 from "error/Error404";

function AppRoute() {
  const userToken = useSelector((state) => state?.auth?.loginToken);
  const isRouteProtected = userToken?.length > 0;
  return (
      <Routes>
        <Route
          path="/"
          element={
            !isRouteProtected ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        {publicRoutes.map((route, idx) => {
          const id = idx * Math.floor(Math.random() * 10);
          return (
            <Route
              key={id}
              path={route.path}
              element={
                isRouteProtected ? (
                  <Navigate
                    to="/dashboard"
                    replace
                    state={{ from: route.path }}
                  />
                ) : (
                  <route.component />
                )
              }
            />
          );
        })}
        {privateRoutes.map((route, idx) => {
          const id = idx * Math.floor(Math.random() * 10);
          return (
            <Route
              key={id}
              path={route.path}
              element={
                !isRouteProtected ? (
                  <Navigate to="/login" replace state={{ from: route.path }} />
                ) : (
                  <MainLayout>
                    <route.component />
                  </MainLayout>
                )
              }
            />
          );
        })}
        <Route path="*" element={<Error404 />} />
      </Routes>
  );
}

export default AppRoute;
