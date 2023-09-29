import React from "react";
import "./App.css";
import UploadComponent from "./components/UploadComponent";
import Logo from "./logo";
import Typography from "@mui/joy/Typography";

function App() {
  return (
    <div className="App">
      <Logo />
      <UploadComponent />
    </div>
  );
}

export default App;
