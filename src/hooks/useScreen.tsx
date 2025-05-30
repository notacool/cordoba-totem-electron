import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ScreenContext {
  screenWidth: number;
  isTotem: boolean;
  isSmallTotem: boolean;
}

export const screenSize = {
  totem: 1079,
  smallTotem: 423,
};

const ScreenContext = createContext<ScreenContext>({} as any);

export const useScreen = () => {
  const ctx = useContext(ScreenContext);
  if (ctx === null) {
    throw new Error(
      "useScreen() can only be used on the descendants of ScreenProvider"
    );
  } else {
    return ctx;
  }
};

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.screen.width);

  const isTotem = useMemo(() => screenWidth <= screenSize.totem, [screenWidth]);
  const isSmallTotem = useMemo(
    () => screenWidth <= screenSize.smallTotem,
    [screenWidth]
  );

  const onResize = () => {
    setScreenWidth(window.screen.width);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const value: ScreenContext = {
    screenWidth,
    isTotem,
    isSmallTotem,
  };

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
};
