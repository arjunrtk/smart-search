import { useEffect, useRef } from "react";
import "./EmpCard.css";

function EmpCard({ empDetails, index, hoverCallback, isActive, text }) {
  const cardRef = useRef(null)

  useEffect(() => {
    highlightText();
    if (isActive) {
      cardRef.current.focus();
    }


  }, [isActive, text]);

  const handleHover = () => {
    hoverCallback(index);
  };

  const highlightText = () => {
    let query = new RegExp(`(${text})`, "gim");
    let name = `${empDetails.name.title} ${empDetails.name.first} ${empDetails.name.last}`;
    let address = `${empDetails.location.street.name} ${empDetails.location.street.number} ${empDetails.location.city} ${empDetails.location.country}`;
    let nameTmp = name.replace(query, `<span class="highlight">$1</span>`);
    let addressTmp = address.replace(query, `<span class="highlight">$1</span>`);
    document.getElementById(`name-${index}`).innerHTML = nameTmp;
    document.getElementById(`address-${index}`).innerHTML = addressTmp;
  }
  return (
    Object.keys(empDetails).length > 0 && (
      <div
        className="card"
        onMouseEnter={() => handleHover()}
        tabIndex={index}
        ref={cardRef}
      >
        <span className="emp-id">
          {empDetails.id.name} {empDetails.id.value}
        </span>
        <span className="emp-name" id={`name-${index}`}>
          
        </span>
        <span className="emp-address" id={`address-${index}`}>
          
        </span>
      </div>
    )
  );
}

export default EmpCard;
