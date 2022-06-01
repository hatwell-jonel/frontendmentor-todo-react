import React, { useState } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
function Header() {
  const body = document.body;
  const [lightTheme, setLightTheme] = useState(false);
  const currentTheme = localStorage.getItem("theme");

  const handleTheme = () => {
    setLightTheme(!lightTheme);
    localStorage.setItem("theme", lightTheme);
  };

  if (currentTheme === "true") {
    body.classList.add("light-theme");
  } else if (currentTheme === "false") {
    body.classList.remove("light-theme");
  }

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">TODO</h1>
        <button type="button" className="theme-btn" onClick={handleTheme}>
          {body.classList.contains("light-theme") ? (
            <>
              <FaMoon />
              <span>dark mode</span>
            </>
          ) : (
            <>
              <BsFillSunFill />
              <span>light mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
