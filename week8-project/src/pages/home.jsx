// src/pages/home.jsx
import crewmates from "../assets/crewmates.png";
import spaceship from "../assets/spaceship.png";
import "../App.css";

function Home() {
  return (
    <>
      <div className="main-content">
        <h1>Welcome to the Crewmate Creator!</h1>
        <p>
          Here is where you can create your very own set of crewmates before
          sending them off into space!
        </p>
        <img
          src={crewmates}
          className="Crew"
          style={{ width: "300px", height: "auto" }}
        />
      </div>

      <img
        src={spaceship}
        className="Crew"
        style={{ width: "300px", height: "auto" }}
      />
    </>
  );
}

export default Home;
