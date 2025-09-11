import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Welcome } from "./pages/Welcome";
// import { Attachment, Totem, TotemSection } from "./types/entities";
import { Totem } from "./types/entities";

export function Body({ totem }: { totem: Totem }) {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home totem={totem} />} />
    </Routes>
  );
}
