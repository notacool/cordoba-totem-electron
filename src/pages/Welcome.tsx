import { useEffect, useMemo, useRef, useState } from "react";
import bgSalvapantallas from "../assets/bg-salvapantallas.svg";
import touch from "../assets/touch.svg";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCarousel } from "../lib/get-carousel";
import { Carousel as CarouselType } from "../types/entities";
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
      console.warn(c);
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

  const images = useMemo(() => {
    if (!carousel || !carousel.attachment_ids) {
      return [];
    }
    return carousel.attachment_ids.map((id) => getContentUrl(id));
  }, [carousel]);

  return isWaiting ? (
    <Carousel enabled={isWaiting} images={images} onClick={handleClick} />
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

const Carousel = ({
  images,
  enabled,
  onClick,
}: {
  images: string[];
  enabled: boolean;
  onClick?: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [enabled, images.length]);

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
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
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
      </AnimatePresence>
    </div>
  );
};
