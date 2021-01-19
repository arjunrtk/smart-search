import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import EmpCard from "./components/EmpCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [empDetails, setEmpDetails] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeOption, setActiveOption] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    fetch("https://randomuser.me/api/?inc=name,location,login,id&results=200")
      .then((r) => r.json())
      .then((r) => r.results)
      .then((r) => {
        setEmpDetails(r);
      });
  }, []);

  const handleSearch = (e) => {
    if (e.length > 0) {
      setIsSearching(true);
      setActiveOption(-1);
      setKeyword(e);
      let suggestTemp = empDetails.filter((d) => {
        let name = `${d.name.title} ${d.name.first} ${d.name.last}`;
        let address = `${d.location.street.name} ${d.location.city} ${d.location.state} ${d.location.country}`;
        //search query
        return (
          name.toLowerCase().includes(e.toLowerCase()) ||
          address.toLowerCase().includes(e.toLowerCase())
        );
      });
      setSuggestions(suggestTemp);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleKeydown = (e) => {
    let activeId = activeOption;
    if (e.keyCode === 38) {
      if (activeId !== 0) {
        activeId = activeId - 1;
        setActiveOption(activeId);
      }
    } else if (e.keyCode === 40) {
      if (activeId !== suggestions.length - 1) {
        activeId = activeId + 1;
        setActiveOption(activeId);
      }
    }
  };

  const handleMouseEnter = (i) => {
    setActiveOption(i);
  };

  const handleClear = () => {
    inputRef.current.value = "";
    setSuggestions([]);
    setIsSearching(false);
    setActiveOption(-1);
  };

  return (
    <div className="search-wrapper" onKeyDown={(e) => handleKeydown(e)}>
      <div className="input-wrapper">
        <FontAwesomeIcon
          icon={faSearch}
          size="lg"
          className="search-input__icon-search"
        />
        <input
          ref={inputRef}
          className="search-input"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faTimes}
          size="lg"
          className="search-input__icon-cross"
          onClick={() => handleClear()}
        />
      </div>
      {suggestions.length === 0 && isSearching && (
        <div className="error-wrapper">No User Found</div>
      )}
      <div className="suggestions-wrapper">
        {suggestions.map((e, i) => {
          return (
            <React.Fragment key={i}>
              <EmpCard
                empDetails={e}
                index={i}
                hoverCallback={handleMouseEnter}
                isActive={i === activeOption}
                text={keyword}
              ></EmpCard>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default App;
