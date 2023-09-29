import React from "react";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import AspectRatio from "@mui/joy/AspectRatio";

const imgStyle = {
  display: "inline-block",
  overflowX: "hidden",
  width: 160,
  mb: 1,
  mt: 1,
};

export default function ImageList({ images, uploaded, getSimilar }) {
  return (
    <Box>
      {uploaded && (
        <Box sx={imgStyle}>
          <AspectRatio ratio="9/16">
            <Link href="#">
              <img src={uploaded} alt="uploaded" />
            </Link>
          </AspectRatio>
          <Typography level="h6" sx={{ mt: 1 }}>
            Source image
          </Typography>
        </Box>
      )}
      {images?.map((image, index) => {
        return (
          <Box sx={imgStyle}>
            <AspectRatio ratio="9/16">
              <Box
                onClick={() => getSimilar(image.image)}
                sx={{ cursor: "pointer" }}
              >
                <img src={image.image} alt={image.name} />
              </Box>
            </AspectRatio>
            <Typography level="h6" sx={{ mt: 1 }} noWrap>
              <Link
                href={
                  image.wiki_url ||
                  "https://www.wikidata.org/wiki/" + image.wiki_id
                }
                target="_blank"
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
