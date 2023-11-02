"use client";
import {
  Autocomplete,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

// define types
type Suggestion = {
  title: string;
  description: string;
  thumbnail?: string;
};

type SearchResult = {
  products: Suggestion[];
};

function AutoSuggest() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [loading, setLoading] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);
    setSuggestions([]);
    setLoading(true);
  };

  const debouncedQuery = useDebounce(query, 600);

  // logic for fetching suggestions
  useEffect(() => {
    if (!debouncedQuery) {
      setLoading(false);
      return;
    }
    // call your backend API for fetching suggestions. We use dummyjson.com as an example. For more information, go to: https://dummyjson.com/docs/products
    fetch(
      `https://dummyjson.com/products/search?q=${debouncedQuery}&select=title,description,thumbnail`
    ).then(async (res) => {
      const json = (await res.json()) as SearchResult;
      setSuggestions(json.products);
      setLoading(false);
    });
  }, [debouncedQuery]);

  return (
    <Autocomplete
      options={suggestions}
      onInputChange={(e) => {}}
      getOptionLabel={(option) => option.title}
      filterOptions={(x) => x} //disable default autocomplete behavior
      renderOption={(props, option) => {
        return (
          <ListItem key={option.title}>
            <ListItemAvatar
              sx={{ height: 100, width: 100, position: "relative" }}
            >
              <Image
                src={option.thumbnail!}
                alt={option.title}
                unoptimized
                fill
                style={{ objectFit: "cover" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={option.title}
              secondary={option.description}
            />
          </ListItem>
        );
      }}
      loading={loading}
      loadingText={"Searching..."}
      noOptionsText="Search for something..."
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder="Search..."
          onChange={handleInputChange}
        />
      )}
    />
  );
}

export default AutoSuggest;
