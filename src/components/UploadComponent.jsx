import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageList from "./ImageList";
import Search from "./Search";

const UploadComponent = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seedImage, setSeedImage] = useState("");

  const demos = [
    {
      name: "Elon Musk",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/440px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg",
    },
    {
      name: "Donald Trump",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg",
    },
    {
      name: "Bruce Springsteen",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Bruce_Springsteen_-_Roskilde_Festival_2012.jpg/440px-Bruce_Springsteen_-_Roskilde_Festival_2012.jpg",
    },
    {
      name: "Cher",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cher_-_Casablanca.jpg/1024px-Cher_-_Casablanca.jpg",
    },
    {
      name: "Taylor Swift",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/440px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png",
    },
  ];

  const processFiles = (files) => {
    const file = files?.[0];
    const url = URL.createObjectURL(file);
    setSeedImage(url);
  };

  const onDrop = (acceptedFiles) => {
    processFiles(acceptedFiles);
    uploadFiles(acceptedFiles);
  };

  const clear = () => {
    setSeedImage();
    setResults({});
  };

  const uploadFiles = async (files) => {
    setError("");
    setResults({});
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const r = await axios.post("/faces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(r.data);
      setError("");
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const getSimilar = async (url) => {
    if (!url?.length) return;
    setError("");
    setResults({});
    setLoading(true);
    setSeedImage(url);
    try {
      const r = await axios.post("/faces", { url });
      setResults(r.data);
      setError("");
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      if (e.clipboardData.files.length === 0) return;
      processFiles(e.clipboardData.files);
      uploadFiles(e.clipboardData.files);
    });
  }, []);

  return (
    <Box>
      <Box sx={{ margin: "auto", width: 400, mt: 2 }}>
        <Search getSimilar={getSimilar} />
      </Box>
      <Box sx={{ m: 2, mr: 6, ml: 6 }}>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <Button
              {...getRootProps()}
              loading={loading}
              variant="outlined"
              sx={{ width: "100%", height: "100px" }}
            >
              <input {...getInputProps()} />
              <p>
                Drag and drop an image here, click to provide one, or paste from
                the clipboard
              </p>
            </Button>
          )}
        </Dropzone>
        {results?.wiki?.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              background: "white",
            }}
          >
            <IconButton aria-label="Close" variant="outlined" onClick={clear}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      {error?.message?.length > 0 && (
        <Box sx={{ m: 2 }}>
          <Alert variant="outlined" color="danger">
            oops! something went wrong: {error.message}
          </Alert>
        </Box>
      )}
      <ImageList
        images={results.wiki}
        uploaded={seedImage}
        getSimilar={getSimilar}
      />
      {!seedImage && (
        <Box>
          <Typography sx={{ mb: 1 }}>Try some of these:</Typography>
          {demos.map((d) => {
            return (
              <Button
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
                key={d.name}
                onClick={() => getSimilar(d.url)}
              >
                {d.name}
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default UploadComponent;
