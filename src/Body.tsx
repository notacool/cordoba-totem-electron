import { Route, Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Welcome } from "./pages/Welcome";
// import { Attachment, Totem, TotemSection } from "./types/entities";
import { useEffect, useState } from "react";
import { Totem, Attachment } from "./types/entities";

export function Body({totem, attachments}: {totem: Totem, attachments: Attachment[]}) {
  
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home totem={totem} attachments={attachments} />} />
        {/* <Route path="/home" element={<Home /> } />
        <Route path="/section/:id" element={<SectionDetail /> } /> */}
      </Routes>
  );
}
