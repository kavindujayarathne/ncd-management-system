import "./Home.css";
import React, { useEffect, useState } from "react";
import imageSlide from "./data";

const Home = () => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentState === 7) {
        setCurrentState(0);
      } else {
        setCurrentState(currentState + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentState]);

  const goToNext = (currentState) => {
    setCurrentState(currentState);
  };

  return (
    <div className="container">
      <div
        className="bg-image"
        style={{ backgroundImage: `url(${imageSlide[currentState].url})` }}
      ></div>
      <div className="description">
        <div>
          <h1>{imageSlide[currentState].title}</h1>
          <p>{imageSlide[currentState].body}</p>
        </div>
        <div className="carousel-bullets">
          {imageSlide.map((slide, index) => (
            <span
              key={index}
              className={index === currentState ? "active" : ""}
              onClick={() => goToNext(index)}
            ></span>
          ))}
        </div>
      </div>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Kavindu Jayarathne. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
