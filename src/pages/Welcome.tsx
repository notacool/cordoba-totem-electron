import bgSalvapantallas from "../assets/bg-salvapantallas.svg";
import touch from "../assets/touch.svg";
import { useNavigate } from "react-router-dom";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="bg"
      style={{ backgroundImage: `url(${bgSalvapantallas})` }}
      onClick={() => navigate("/home")}
    >
      <div className="welcomeContainer">
        <span className="welcomeText">Bienvenido</span>
        <span className="welcomeSubtext">
          Al punto de información turístico de la ciudad de{" "}
        </span>
      </div>
      <div className="startContainer">
        <span className="startText">Inicio</span>
      </div>
      <img
        style={{ position: "absolute", top: "56.5%", left: "58%" }}
        src={touch}
        width="7%"
      />
    </div>
  );
}
