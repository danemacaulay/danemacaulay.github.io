import React from "react";
import "./App.css";
import UploadComponent from "./components/UploadComponent";
import Clusters from "./components/Clusters";
import Logo from "./logo";
import { Box, Typography } from "@mui/joy";
import { Routes, Route, Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Box>
              <Logo />
              <Outlet />
            </Box>
          }
        >
          <Route index element={<UploadComponent />} />
          <Route path="clusters" element={<Clusters />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
