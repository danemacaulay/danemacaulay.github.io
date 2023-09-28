import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import Link from "@mui/joy/Link";
import AspectRatio from "@mui/joy/AspectRatio";

function ImageList({ images, uploaded }) {
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
      {images?.map((image, index) => (
        <Box
          key={index}
          sx={{ display: "inline-block", overflowX: "hidden", width: 200 }}
        >
          <AspectRatio ratio="9/16">
            <Link
              href={image.wiki_url ? image.wiki_url : "#"}
              target="_blank"
              disabled={!image.wiki_url}
            >
              <img src={image.image} alt={image.name} />
            </Link>
          </AspectRatio>
          <Typography level="h6" noWrap>
            {image.name} - {parseFloat(image.score).toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const UploadComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
    uploadFiles(acceptedFiles);
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
      const r = await axios.post("https://www.facesearch.net/faces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(r.data);
      setError("");
      // Handle successful upload
    } catch (error) {
      setError(error);
      // Handle upload error
    }
    setLoading(false);
  };

  const file = uploadedFiles?.[0];
  const uploaded = file ? URL.createObjectURL(file) : false;

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
      <ImageList images={results.wiki} uploaded={uploaded} />
    </Box>
  );
};

export default UploadComponent;
