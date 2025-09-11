import bgHome from "../assets/bg-home.svg";
import topBar from "../assets/top_bar.svg";
import foto1 from "../assets/foto1.png";
import qrImage from "../assets/QR.png";
import swipe from "../assets/swipe.svg";
import cordoba from "../assets/cordoba-es-mas.svg";
import right from "../assets/right.svg";
import left from "../assets/left.svg";
import right2 from "../assets/right2.svg";
import home from "../assets/home.svg";
import { useNavigate } from "react-router-dom";
import { Attachment, Content, ContentWithId, Totem } from "../types/entities";
import { useEffect, useMemo, useRef, useState } from "react";
import camera from "../assets/camera.svg";
import video from "../assets/video.svg";
import bgFooterCard from "../assets/bg-footer-card.svg";
import { getContentType, getContentUrl } from "../utils/content";
import { header, main } from "framer-motion/client";
import { getAttachment } from "../lib/get-attachment";
import { m } from "framer-motion";
export function Home({ totem }: { totem: Totem }) {
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<number>();

  const [content, setContent] = useState<ContentWithId[]>([]);
  const [headerContent, setHeaderContent] = useState<ContentWithId>();
  const [headerContentName, setHeaderContentName] = useState<string>("");

  useEffect(() => {
    // classify all URLs on mount
    Promise.all(
      totem.attachment_ids.map(async (id) => {
        const url = getContentUrl(id);
        const type = await getContentType(url);
        return { url, type, id };
      })
    ).then(setContent);
  }, [totem]);

  useEffect(() => {
    if (content.length > 0) {
      setPages(Math.ceil(content.length / 3));
      setHeaderContent(content[0]);
    }
  }, [content]);

  const carouselContent = useMemo(() => {
    if (!headerContent) {
      return content.slice(1);
    }
    return content.filter((c) => c.id !== headerContent.id);
  }, [headerContent]);

  // fetch attachment name

  useEffect(() => {
    const fetchAttachmentName = async () => {
      if (!headerContent) return;
      try {
        const attachment = await getAttachment(headerContent.id);
        setHeaderContentName(attachment.name);
      } catch (err) {
        console.error(err);
        return "";
      }
    };
    fetchAttachmentName();
  }, [headerContent]);

  const [web, setWeb] = useState(false);

  const prev = () => {
    if (page === 0 && pages) {
      setPage(pages - 1);
    } else {
      setPage(page - 1);
    }
  };

  const next = () => {
    if (pages && page === pages - 1) {
      setPage(0);
    } else {
      setPage(page + 1);
    }
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // 🛠️ Si existe un timeout anterior, lo limpiamos
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // ⏳ Configuramos un nuevo timeout
    timeoutRef.current = setTimeout(() => {
      navigate("/");
    }, 120000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "touchstart", "visibilitychange"];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // Iniciar temporizador al cargar

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navigate = useNavigate();
  return (
    <div className="bg" style={{ backgroundImage: `url(${bgHome})` }}>
      <div className="homeTextContainer">
        <div className="headerContainer">
          <button className="headerButton" onClick={() => navigate("/")}>
            <img src={home} width="40px" />
            <span className="headerButtonText">Inicio</span>
          </button>

          <h1 className="headerTitle">Bienvenido a Córdoba</h1>
        </div>
      </div>

      <div className="contentContainer">
        {/* <img src={topBar} width="93.25%" /> */}
        {!web ? (
          <div className="content">
            {/* START HERO */}
            <div className="heroContainer">
              {headerContent?.type === "image" && (
                <img src={headerContent.url} className="heroImage" />
              )}
              {headerContent?.type === "video" && (
                <video
                  key={headerContent.url}
                  className="heroImage"
                  autoPlay
                  muted
                  loop
                  preload="auto"
                >
                  <source src={headerContent.url} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              )}
              <div className="heroLabelContainer">
                <span className="heroLabel">{headerContentName}</span>
              </div>
            </div>
            {/* END HERO */}
            {/* START CAROUSEL */}
            <div className="carousel">
              <div onClick={prev} style={{ cursor: "pointer" }}>
                <img
                  src={left}
                  style={{ minHeight: "40px", minWidth: "40px" }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // always 3 slots
                  gap: "10px",
                  width: "100%",
                  height: "100%",
                }}
              >
                {content.length > 0 && (
                  <>
                    {content
                      .slice(page * 3, page * 3 + 3)
                      .map((contentItem) => {
                        if (contentItem.type === "image") {
                          return (
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                              }}
                              onClick={() => setHeaderContent(contentItem)}
                            >
                              <img
                                src={contentItem.url}
                                height={"100%"}
                                width={"100%"}
                                style={{ objectFit: "cover" }}
                              />
                              <div
                                style={{
                                  width: "15%",
                                  position: "absolute",
                                  top: "70%",
                                  left: "6%",
                                }}
                              >
                                <img src={camera} width={"100%"} />
                              </div>
                            </div>
                          );
                        }
                        if (contentItem.type === "video") {
                          return (
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                              }}
                              onClick={() => {
                                console.warn(contentItem);
                                setHeaderContent(contentItem);
                              }}
                            >
                              <video
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                muted
                                loop
                              >
                                <source
                                  src={contentItem.url}
                                  type="video/mp4"
                                />
                                Tu navegador no soporta el elemento de video.
                              </video>
                              <div
                                style={{
                                  width: "15%",
                                  position: "absolute",
                                  top: "70%",
                                  left: "6%",
                                }}
                              >
                                <img src={video} width={"100%"} />
                              </div>
                            </div>
                          );
                        }
                      })}
                  </>
                )}
              </div>

              <div onClick={next} style={{ cursor: "pointer" }}>
                <img
                  src={right2}
                  style={{ minHeight: "40px", minWidth: "40px" }}
                />
              </div>
            </div>
            <div className="pagination">
              {pages
                ? Array.from({ length: pages }, (_, i) => (
                    <div className={page === i ? `page1` : `page2`}></div>
                  ))
                : undefined}
            </div>
            <div className="footerCardContainer">
              <div
                className="footerCard"
                style={{
                  backgroundImage: `url(${bgFooterCard})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h1 className="footerCardTitle">Consulta la web de turismo</h1>
                <button className="accessButton" onClick={() => setWeb(true)}>
                  <span>Accede</span>
                  <img src={right} width={"100%"} />
                </button>
              </div>
              <div className="footerCard footerCardBorder">
                <h1 className="footerCardTitle">Descarga la APP</h1>
                <img src={qrImage} alt="" className="footerCardQR" />
              </div>
            </div>
          </div>
        ) : (
          <div className="content">
            <iframe
              src={`http://localhost:3000/proxy?url=${encodeURIComponent(
                totem?.url
              )}`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="WebView"
            />
          </div>
        )}
      </div>
    </div>
  );
}
