import { useState } from "react";
import { TextField, InputAdornment, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Buscador = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    window.location.href = `/search?q=${searchTerm}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <TextField
        type="text"
        className="search-input"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box marginLeft={1}>
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>
    </>
  );
};

export default Buscador;
