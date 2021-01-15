import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef } from "react";

function App() {
  const [empDetails, setEmpDetails] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeOption, setActiveOption] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const optionsRef = useRef(null);

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
    let elm = optionsRef.current;
    if (e.keyCode === 38) {
      if (activeId !== 0) {
        activeId = activeId - 1;
      }
    } else if (e.keyCode === 40) {
      if (activeId !== suggestions.length - 1) {
        activeId = activeId + 1;
      }
    }
    setActiveOption(activeId);
    if (
      elm &&
      elm.children.length > 0 &&
      (e.keyCode === 40 || e.keyCode === 38)
    ) {
      elm.children[activeId].focus();
    }
  };

  const handleMouseEnter = (i) => {
    let elm = optionsRef.current;
    setActiveOption(i);
    if (elm && elm.children.length) {
      elm.children[i].focus();
    }
  };

  return (
    <div className="search-wrapper" onKeyDown={(e) => handleKeydown(e)}>
      <input
        className="search-input"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {suggestions.length === 0 && isSearching && (
        <div className="error-wrapper">No User Found</div>
      )}
      <div className="suggestions-wrapper" ref={optionsRef}>
        {suggestions.map((e, i) => {
          return (
            <div
              key={i}
              className="card"
              onMouseEnter={() => handleMouseEnter(i)}
              tabIndex={i}
            >
              <h4>
                {e.id.name} {e.id.value}
              </h4>
              <h3>
                {e.name.title} {e.name.first} {e.name.last}
              </h3>
              <p>
                {e.location.street.name} {e.location.street.number}{" "}
                {e.location.city} {e.location.country}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
