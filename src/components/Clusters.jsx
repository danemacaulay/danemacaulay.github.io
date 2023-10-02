import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageList from "./ImageList";
import Search from "./Search";
import Pagination from "@mui/material/Pagination";

const Clusters = () => {
  const [results, setResults] = useState([]);
  const [cluster, setCluster] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 16;
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      cluster,
      page,
      limit,
    };
    axios.get("/clusters", { params }).then((response) => {
      setResults(response?.data);
      setLoading(false);
      const t = response?.data?.[0]?.total;
      if (t) setTotal(Math.round(t / limit));
    });
  }, [cluster, page]);

  return (
    <Box>
      Clusters
      <Input
        value={cluster}
        type="number"
        onChange={(event) => setCluster(event.target.value)}
      />
      <Pagination
        disabled={loading}
        boundaryCount={2}
        count={total}
        page={page}
        onChange={handleChange}
      />
      <ImageList images={results} />
    </Box>
  );
};

export default Clusters;

// 0 old fashioned dames
// 7 younger asian men
// 9 cute white chicks
// 15 cute asian chicks
// 23 young asian men
// 28 athletic white guys
// 37 athletic white guys
// 41 old white ladies
// 42 cute white chicks
// 52 indian dudes
// 66 indian chicks
// 67 somewhat cute chicks
// 78 persian chicks
// 86 young black men
// 90 black women
// 98 smiling women
// 99 mixed women
