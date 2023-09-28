import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import Link from "@mui/joy/Link";
import AspectRatio from "@mui/joy/AspectRatio";

function ImageList({ images, uploaded, getSimilar }) {
  return (
    <Box>
      {uploaded && (
        <Box sx={{ display: "inline-block", overflowX: "hidden", width: 200 }}>
          <AspectRatio ratio="9/16">
            <Link href="#">
              <img src={uploaded} alt="uploaded" />
            </Link>
          </AspectRatio>
          <Typography level="h6">Uploaded</Typography>
        </Box>
      )}
      {images?.map((image, index) => {
        return (
          <Box
            key={index}
            sx={{ display: "inline-block", overflowX: "hidden", width: 200 }}
          >
            <AspectRatio ratio="9/16">
              <Box
                onClick={() => getSimilar(image.image)}
                sx={{ cursor: "pointer" }}
              >
                <img src={image.image} alt={image.name} />
              </Box>
            </AspectRatio>
            <Typography level="h6" noWrap>
              <Link
                href={image.wiki_url ? image.wiki_url : "#"}
                target="_blank"
                disabled={!image.wiki_url}
              >
                {image.name} - {parseFloat(image.score).toFixed(2)}
              </Link>
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

const UploadComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seedImage, setSeedImage] = useState("");

  const onDrop = (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
    uploadFiles(acceptedFiles);
    const file = uploadedFiles?.[0];
    const url = URL.createObjectURL(file);
    setSeedImage(url);
  };

  const uploadFiles = async (files) => {
    setError("");
    setResults({});
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
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

  return (
    <Box>
      <Box sx={{ m: 2 }}>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <Button
              {...getRootProps()}
              loading={loading}
              variant="outlined"
              sx={{ width: "100%", height: "100px" }}
            >
              <input {...getInputProps()} />
              <p>Drag and drop a file here, or click to select a file</p>
            </Button>
          )}
        </Dropzone>
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
    </Box>
  );
};

export default UploadComponent;
