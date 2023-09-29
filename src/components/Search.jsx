import {
  Autocomplete,
  FormControl,
  FormHelperText,
  AutocompleteOption,
  ListItemContent,
} from "@mui/joy";
import debounce from "lodash.debounce";

import { useState, useCallback } from "react";

const Search = ({ getSimilar }) => {
  const [options, setOptions] = useState([]);
  const [isPerson, setIsPerson] = useState(true);

  const fetchMainImage = async (pageId) => {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&pageids=${pageId}&piprop=original`,
    );
    const data = await response.json();
    const page = data.query.pages[pageId];
    return page.original ? page.original.source : null;
  };

  const fetchCategories = async (pageId) => {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=categories&format=json&origin=*&pageids=${pageId}`,
    );
    const data = await response.json();
    const page = data.query.pages[pageId];
    const categories = page.categories
      ? page.categories.map((category) => category.title)
      : [];
    const isPerson = categories.some(
      (category) =>
        category.includes("births") || categories.includes("Living people"),
    );
    return isPerson;
  };

  const fetchOptions = useCallback(
    debounce(async (searchTerm) => {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${searchTerm}`,
      );
      const data = await response.json();
      const filteredResults = data?.query?.search;
      setOptions(filteredResults);
    }, 500), // 500ms delay
    [],
  );

  return (
    <FormControl error={!isPerson}>
      <Autocomplete
        placeholder="Search for people in Wikipedia"
        onInputChange={(event, newValue) => {
          setIsPerson(true);
          if (newValue.length < 2) return;
          fetchOptions(newValue);
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            fetchCategories(newValue.pageid).then((isPerson) => {
              setIsPerson(isPerson);
              if (!isPerson) return;
              fetchMainImage(newValue.pageid).then(getSimilar);
            });
          }
        }}
        options={options}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        renderOption={(props, option) => (
          <AutocompleteOption {...props}>
            <ListItemContent sx={{ fontSize: "sm" }}>
              {option.title}
            </ListItemContent>
          </AutocompleteOption>
        )}
      />
      {!isPerson && <FormHelperText>Could not find a picture</FormHelperText>}
    </FormControl>
  );
};

export default Search;
