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
import { Attachment, Totem } from "../types/entities";
import { useEffect, useRef, useState } from "react";
import camera from "../assets/camera.svg";
import video from "../assets/video.svg";
import bgFooterCard from "../assets/bg-footer-card.svg";
export function Home({
  totem,
  attachments,
}: {
  totem: Totem;
  attachments: Attachment[];
}) {
  const [attachmentToShow, setAattachmentToShow] = useState(attachments[0]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState<number>();

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

  useEffect(() => {
    setPages(
      Math.ceil(
        attachments.filter(
          (attachment) => attachment.id !== attachmentToShow.id
        ).length / 3
      )
    );
  }, [attachments]);

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
              {attachmentToShow.index_content === "image" ? (
                <img
                  src={"data:image/jpeg;base64," + attachmentToShow.datas}
                  className="heroImage"
                />
              ) : (
                <video
                  className="heroImage"
                  autoPlay
                  muted
                  loop
                  controls
                  controlsList="nofullscreen nodownload noremoteplayback"
                >
                  <source
                    src={`data:video/mp4;base64,${attachmentToShow.datas}`}
                    type="video/mp4"
                  />
                  Tu navegador no soporta el elemento de video.
                </video>
              )}
              <div className="heroLabelContainer">
                <span className="heroLabel">
                  {attachmentToShow.name.split(".")[0]}
                </span>
              </div>
            </div>
            {/* END HERO */}
            {/* START CAROUSEL */}
            <div className="carousel">
              <div onClick={prev}>
                <img src={left} width={"100%"} />
              </div>
              {attachments
                .filter((attachment) => attachment.id !== attachmentToShow.id)
                .slice(page * 3, page * 3 + 3)
                .map((attachment) => {
                  return attachment.index_content === "image" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => setAattachmentToShow(attachment)}
                    >
                      <img
                        src={"data:image/jpeg;base64," + attachment.datas}
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
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={() => setAattachmentToShow(attachment)}
                    >
                      <video
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        autoPlay
                        muted
                        loop
                      >
                        <source
                          src={`data:video/mp4;base64,${attachment.datas}`}
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
                })}
              <div onClick={next}>
                <img src={right2} width={"100%"} />
              </div>
            </div>
            <div className="pagination">
              {pages
                ? Array.from({ length: pages }, (_, i) => (
                    <div className={page === i ? `page1` : `page2`}></div>
                  ))
                : undefined}
            </div>
            {/* <div
              className="access"
              style={{
                backgroundImage: `url(${cordoba})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            >
              <span className="accessText">
                Consulta la web de Turismo de Córdoba
              </span> */}
            {/* <button className="accessButton" onClick={() => setWeb(true)}>
                <span>Accede</span>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src={right} width={"100%"} />
                </div>
              </button> */}
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
