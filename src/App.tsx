import { BrowserRouter as Router } from "react-router-dom";
import { Body } from "./Body";
import { ScreenProvider } from "./hooks/useScreen";
import "./App.css";
import { useEffect, useState } from "react";
import { Attachment, Totem } from "./types/entities";

function App() {

    const [totem, setTotem] = useState<Totem>();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        const authResponse = await fetch(`/api/web/session/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: {
                db: import.meta.env.VITE_ODOO_DB,
                login: import.meta.env.VITE_ODOO_USERNAME,
                password: import.meta.env.VITE_ODOO_PASSWORD,
                },
            }),
        }); 

        const authData = await authResponse.json();

        if (!authData.result) {
            throw new Error("Error de autenticación en Odoo");
        }
        const sessionId = authResponse.headers.get("set-cookie")?.split(";")[0];
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (sessionId) {
            headers["Cookie"] = sessionId;
        }

        const response = await fetch(
            `/api/web/dataset/call_kw/notacool_gm.totem/search_read`,
            {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "call",
                    params: {
                        model: "notacool_gm.totem",
                        method: "search_read",
                        args: [], // Puedes filtrar usuarios aquí si es necesario
                        kwargs: {}, // Campos que quieres obtener
                    },
                }),
            }
        );

        const data = await response.json();
        setTotem(data.result[0])
    };

    const fetchAttachments = async () => {
        console.log(totem?.attachment_ids)
        const authResponse = await fetch(`/api/web/session/authenticate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "call",
                params: {
                db: import.meta.env.VITE_ODOO_DB,
                login: import.meta.env.VITE_ODOO_USERNAME,
                password: import.meta.env.VITE_ODOO_PASSWORD,
                },
            }),
        }); 


        const authData = await authResponse.json();

        if (!authData.result) {
            throw new Error("Error de autenticación en Odoo");
        }
        const sessionId = authResponse.headers.get("set-cookie")?.split(";")[0];
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (sessionId) {
            headers["Cookie"] = sessionId;
        }

        let arr: Attachment[] = [];
        for (const id of totem?.attachment_ids || []) {
          try {
            const response = await fetch(
              `/api/web/dataset/call_kw/ir.attachment/search_read`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  method: "call",
                  params: {
                    model: "ir.attachment",
                    method: "search_read",
                    args: [[["id", "=", id]]],
                    kwargs: {},
                  },
                }),
              }
            );
            const data = await response.json();
            if (data.result && data.result.length > 0) {
              console.log(data.result)
              arr.push(data.result[0]);
            } else {
              console.warn(`⚠️ Video con ID ${id} no encontrado`);
            }
          } catch (error) {
            console.error(`❌ Error al obtener el video ID ${id}:`, error);
          }
        }
        setAttachments(arr);
    };

    useEffect(() => {
        fetchAttachments()
    }, [totem]);

    useEffect(() => {
      console.log(attachments);
    }, [attachments])
    

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
          fetchData();
        }, 1800000); //30 minutos
        return () => clearInterval(interval);
      }, []);

  return totem && attachments.length > 0 && (
    <ScreenProvider>
      <Router>
        <Body totem={totem} attachments={attachments}></Body>
      </Router>
    </ScreenProvider>
  );
}

export default App;
