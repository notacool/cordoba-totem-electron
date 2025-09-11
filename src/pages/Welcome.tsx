import { useEffect, useMemo, useRef, useState } from "react";
import bgSalvapantallas from "../assets/bg-salvapantallas.svg";
import touch from "../assets/touch.svg";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCarousel } from "../lib/get-carousel";
import { Carousel as CarouselType, Content } from "../types/entities";
import { getContentUrl } from "../utils/content";

export function Welcome() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [carousel, setCarousel] = useState<CarouselType>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsWaiting(true);
    }, 20000); // 20 seconds
  };

  const fetchCarousel = async () => {
    try {
      const c = await getCarousel();
      setCarousel(c);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startTimer();
    fetchCarousel();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    setIsWaiting(false);
    startTimer(); // restart waiting countdown
  };

  const urls = useMemo(() => {
    if (!carousel || !carousel.attachment_ids) {
      return [];
    }
    return carousel.attachment_ids.map((id) => getContentUrl(id));
  }, [carousel]);

  return isWaiting ? (
    <Carousel enabled={isWaiting} urls={urls} onClick={handleClick} />
  ) : (
    <WelcomeComponent />
  );
}

const WelcomeComponent = () => {
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
};


const getContentType = async (
  url: string
): Promise<"image" | "video" | "unknown"> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("content-type");
    if (contentType?.startsWith("image")) return "image";
    if (contentType?.startsWith("video")) return "video";
    return "unknown";
  } catch {
    return "unknown";
  }
};

const Carousel = ({
  urls,
  enabled,
  onClick,
}: {
  urls: string[];
  enabled: boolean;
  onClick?: () => void;
}) => {
  const [slides, setSlides] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    // classify all URLs on mount
    Promise.all(
      urls.map(async (url) => ({
        url,
        type: await getContentType(url),
      }))
    ).then(setSlides);
  }, [urls]);

  useEffect(() => {
    if (!enabled || slides.length === 0) return;

    const current = slides[currentIndex];

    if (current?.type === "image") {
      const timer = setTimeout(nextSlide, 8000);
      return () => clearTimeout(timer);
    }

    if (current?.type === "video" && videoRef.current) {
      const handleEnded = () => nextSlide();
      const video = videoRef.current;
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [enabled, slides, currentIndex]);

  const current = slides[currentIndex];

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "white",
      }}
      onClick={onClick}
    >
      <AnimatePresence mode="sync">
        {current?.type === "image" && (
          <motion.img
            key={`img-${currentIndex}`}
            src={current.url}
            alt={`carousel-${currentIndex}`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
        {current?.type === "video" && (
          <motion.video
            key={`vid-${currentIndex}`}
            ref={videoRef}
            src={current.url}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
