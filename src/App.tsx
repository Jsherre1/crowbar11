import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

// Normal (light) versions:
const DeliveryLogoFullSrc = require("./assets/DeliveryLogoFull.svg").default;
const DeliveryLogoSmallSrc = require("./assets/DeliveryLogoSmall.svg").default;
const DeliveryLogoSmallLavenderSrc =
  require("./assets/DeliveryLogoSmallLavender.svg").default;
const DeliveryCartIconSrc = require("./assets/DeliveryCartIcon.svg").default;

// White (dark) versions:
const DeliveryLogoFullWhiteSrc =
  require("./assets/DeliveryLogoFullWhite.svg").default;
const DeliveryLogoSmallWhiteSrc =
  require("./assets/DeliveryLogoSmallWhite.svg").default;
const DeliveryCartIconWhiteSrc =
  require("./assets/DeliveryCartIconWhite.svg").default;

// User icons
const UserIconSrc = require("./assets/User.svg").default;
const UserIconWhiteSrc = require("./assets/UserWhite.svg").default;

// “Just Breathe” logos
const JustBretheLogoSrc = require("./assets/JustBretheLogo.svg").default;
const JustBretheLogoWhiteSrc =
  require("./assets/JustBretheLogoWhite.svg").default;

// Day/Night icons – (we’re no longer using these for product cards)
const SunSvg = require("./assets/Sun.svg").default;
const MoonSvg = require("./assets/Moon.svg").default;
const SunWhiteSvg = require("./assets/SunWhite.svg").default;
const MoonWhiteSvg = require("./assets/MoonWhite.svg").default;

// For BING / Road icons
const BingSvg = require("./assets/Bing.svg").default;
const BingWhiteSvg = require("./assets/BingWhite.svg").default;
const RoadSvg = require("./assets/Road.svg").default;
const RoadWhiteSvg = require("./assets/RoadWhite.svg").default;

// Map
import MapComponent from "./MapComponent";

// ---- NEW: product card icons that do NOT change by theme
const SunYellowSvg = require("./assets/SunYellow.svg").default;
const MoonBlueSvg = require("./assets/MoonBlue.svg").default;
const HybridSvg = require("./assets/Hybrid.svg").default;

// Constants
const LOADING_DELAY = 1500;
const FADE_DURATION = 800; // ms for fade animations
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// -----------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------
interface LoadingScreenProps {
  animateOut: boolean;
  onAnimationComplete: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface AgeGateProps {
  onYes: () => void;
  onNo: () => void;
  animateOut: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
interface ProductCardProps {
  productKey: string;
  title?: string;
  category?: string;
  brand?: string;
}
interface ProductCarouselProps {
  title: string;
  itemCount: number;
}
interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  hideIcon?: boolean;
}

// -----------------------------------------------------------------
// App Root
// -----------------------------------------------------------------
function App() {
  const [animateOut, setAnimateOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("loading");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Fade out loading screen
  useEffect(() => {
    const timer = setTimeout(() => setAnimateOut(true), LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setCurrentScreen("ageGate");
    setAnimateOut(false);
  };

  const handleAgeYes = () => {
    setAnimateOut(true);
    setTimeout(() => {
      localStorage.setItem("isOfAge", "true");
      setCurrentScreen("home");
      setAnimateOut(false);
    }, FADE_DURATION);
  };
  const handleAgeNo = () => {
    alert("Sorry, you must be 21 or older to view this content.");
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "loading":
        return (
          <LoadingScreen
            animateOut={animateOut}
            onAnimationComplete={handleLoadingComplete}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case "ageGate":
        return (
          <AgeGate
            onYes={handleAgeYes}
            onNo={handleAgeNo}
            animateOut={animateOut}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case "home":
        return (
          <HomePage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        );
      default:
        return (
          <LoadingScreen
            animateOut={animateOut}
            onAnimationComplete={handleLoadingComplete}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        );
    }
  };

  return <>{renderScreen()}</>;
}

// -----------------------------------------------------------------
// Theme Toggle (used in header, optionally hide day/night icon)
// -----------------------------------------------------------------
function ThemeToggle({ isDarkMode, onToggle, hideIcon }: ThemeToggleProps) {
  const handleClick = () => {
    onToggle();
  };

  // If we do NOT hide the icon, pick day/night
  let iconSrc = "";
  if (!hideIcon) {
    iconSrc = isDarkMode ? MoonWhiteSvg : SunSvg;
  }

  return (
    <div className="theme-toggle" onClick={handleClick}>
      {iconSrc && (
        <img src={iconSrc} alt="theme icon" className="toggle-icon-simple" />
      )}
      <div className={`toggle-track ${isDarkMode ? "active" : ""}`}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Loading Screen
// -----------------------------------------------------------------
function LoadingScreen({
  animateOut,
  onAnimationComplete,
  isDarkMode,
}: LoadingScreenProps) {
  useEffect(() => {
    if (animateOut) {
      const timer = setTimeout(onAnimationComplete, FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [animateOut, onAnimationComplete]);

  const fullLogo = isDarkMode ? DeliveryLogoFullWhiteSrc : DeliveryLogoFullSrc;

  return (
    <div
      className={`screen loading-screen ${animateOut ? "fade-out" : "fade-in"}`}
    >
      <div className="loading-main-content">
        <div className={`logo-container ${animateOut ? "logo-shrink" : ""}`}>
          <img
            src={fullLogo}
            alt="Cannabis delivery logo"
            className="logo"
            style={{ width: "198px" }}
          />
        </div>
        <div
          className="powered-by-container"
          style={{ marginTop: "6rem" /* nudge down */ }}
        >
          <p className="loading-subtitle powered-by-text">
            {"powered by ".split("").map((char, i) => (
              <span
                key={i}
                className="wave-letter"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                {char}
              </span>
            ))}
          </p>
          <img
            src={JustBretheLogoSrc}
            alt="Just Breathe"
            className="just-breathe-logo"
            style={{ transform: "scale(1.8)", marginTop: "0.5rem" }}
          />
        </div>
      </div>

      <footer className="screen-footer">
        <p className="terms-text" style={{ fontWeight: "normal" }}>
          Terms and Conditions
        </p>
        <p>Just Breathe Dispensary © 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}

// -----------------------------------------------------------------
// AgeGate
// -----------------------------------------------------------------
function AgeGate({
  onYes,
  onNo,
  animateOut,
  isDarkMode,
  toggleDarkMode,
}: AgeGateProps) {
  const [modeMessage, setModeMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // If >=7pm, auto dark mode + "indica mode"
  useEffect(() => {
    if (new Date().getHours() >= 19 && !isDarkMode) {
      toggleDarkMode();
      setModeMessage("indica mode");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
    // eslint-disable-next-line
  }, []);

  const handleToggle = () => {
    const goingDark = !isDarkMode;
    toggleDarkMode();
    const newMsg = goingDark ? "indica mode" : "sativa mode";
    setModeMessage(newMsg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div
      className={`screen agegate-screen ${animateOut ? "fade-out" : "fade-in"}`}
    >
      <div className="agegate-content-wrapper">
        <div
          className="agegate-toggle"
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <ThemeToggle isDarkMode={isDarkMode} onToggle={handleToggle} />
          <div className={`mode-message ${showMessage ? "show" : ""}`}>
            {modeMessage}
          </div>
        </div>

        <div className="agegate-main-content">
          <h1 className="agegate-title">we have to ask...</h1>
          <p className="agegate-subtitle">are you 21 or older?</p>
          <div className="agegate-buttons">
            <button className="btn-yes gradient-swipe" onClick={onYes}>
              yes
            </button>
            <button className="btn-no" onClick={onNo}>
              no
            </button>
          </div>
        </div>
      </div>

      <footer className="screen-footer">
        <p className="terms-text" style={{ fontWeight: "normal" }}>
          Terms and Conditions
        </p>
        <p>Just Breathe Dispensary © 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}

// -----------------------------------------------------------------
// HOME PAGE
//
// #1: We'll do the same "indica/sativa" message on toggle.
// #2: Move "2.4 mi away" to a second row.
// #3: Product card icons => SunYellow, MoonBlue, Hybrid.
// #4: After "Edibles" => JustBreathe => 'cannabis store' => <hr> => hours => map => disclaimers
// -----------------------------------------------------------------
function HomePage({ isDarkMode, toggleDarkMode }: HomePageProps) {
  const [countdown, setCountdown] = useState("");
  const [modeMessage, setModeMessage] = useState("");
  const [showModeMessage, setShowModeMessage] = useState(false);

  // The normal or white icons for user & cart
  const userIcon = isDarkMode ? UserIconWhiteSrc : UserIconSrc;
  const cartIcon = isDarkMode ? DeliveryCartIconWhiteSrc : DeliveryCartIconSrc;

  // Banner
  const bannerUrl = isDarkMode
    ? "https://i.postimg.cc/63wfq3gc/foxtrotter-wide-copy2-copy1.jpg"
    : "https://i.postimg.cc/NMTJW05t/header-copy2-copy.jpg";

  // day of week
  const currentDay = daysOfWeek[new Date().getDay()];

  // Delivery hours [19..23], filter out past hours
  const validHours = [19, 20, 21, 22, 23].filter(
    (h) => h > new Date().getHours()
  );
  const closestHour = validHours.length ? validHours[0] : null;

  // countdown
  useEffect(() => {
    const t = setInterval(() => {
      if (closestHour !== null) {
        setCountdown(calculateRemainingTime(closestHour));
      } else {
        setCountdown("");
      }
    }, 1000);
    return () => clearInterval(t);
  }, [closestHour]);

  // #1: handle toggle => show "indica" / "sativa" message
  const handleHeaderToggle = () => {
    const goingDark = !isDarkMode;
    toggleDarkMode();
    const newMsg = goingDark ? "indica mode" : "sativa mode";
    setModeMessage(newMsg);
    setShowModeMessage(true);
    setTimeout(() => setShowModeMessage(false), 2000);
  };

  // scroller for times
  const timeCarouselRef = useRef<HTMLDivElement>(null);
  const scrollTimes = (dir: "left" | "right") => {
    if (!timeCarouselRef.current) return;
    timeCarouselRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="screen home-screen fade-in">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img
            src={isDarkMode ? DeliveryLogoSmallWhiteSrc : DeliveryLogoSmallSrc}
            alt="Small Logo"
            className="header-main-logo"
          />
          <div className="header-text-group">
            <h2 className="header-title">cannabis delivery</h2>
            <div className="header-subtitle">
              by{" "}
              <img
                src={JustBretheLogoWhiteSrc}
                alt="Just Breathe"
                className="subtitle-logo"
              />
            </div>
          </div>
        </div>

        <div className="header-right" style={{ position: "relative" }}>
          {/* Toggle (25% smaller) & custom message */}
          <div style={{ position: "relative" }}>
            <ThemeToggle
              isDarkMode={isDarkMode}
              onToggle={handleHeaderToggle}
              hideIcon
            />
            {/* Same fade/slide text for "indica mode" or "sativa mode" */}
            <div
              className={`mode-message ${showModeMessage ? "show" : ""}`}
              style={{
                top: "100%", // so it sits below the toggle
                right: "50%",
                left: "auto",
                transform: "translate(50%, 0.3rem)",
                // adjusted so it doesn't fall off the screen
                whiteSpace: "nowrap",
                minWidth: "100px",
              }}
            >
              {modeMessage}
            </div>
          </div>

          {/* user icon */}
          <img
            src={userIcon}
            alt="User"
            className="header-user-icon"
            style={{ width: "24px" }}
          />
          {/* cart icon, bigger scale in CSS */}
          <img src={cartIcon} alt="Cart" className="header-cart-icon" />
        </div>
      </header>

      {/* Banner */}
      <div className="banner-container">
        <img src={bannerUrl} alt="Banner" />
      </div>

      {/* Delivery Info */}
      <div className="delivery-section-container">
        <div className="delivery-info-flex">
          <div className="delivery-logo-col">
            <div className="arcade-logo-card">
              <img
                src="https://d2s742iet3d3t1.cloudfront.net/restaurants/restaurant-169145000000000000/banner_1704835055.png?size=medium"
                alt="Crowbar Arcade Logo"
              />
            </div>
          </div>
          <div className="delivery-text-col">
            <p
              style={{
                color: "var(--medium-grey)",
                fontSize: "var(--fs-1)",
                marginBottom: "0.2rem",
              }}
            >
              delivery to...
            </p>
            <h3
              className="location-title"
              style={{ textAlign: "left", marginTop: 0 }}
            >
              Crowbar Arcade
            </h3>
            <div
              className="arcade-info-boxes"
              style={{ marginTop: "0.5rem", flexWrap: "nowrap" }}
            >
              {/* first row */}
              <div className="info-card" style={{ fontWeight: "normal" }}>
                195 State St
              </div>
              <div className="info-card" style={{ fontWeight: "normal" }}>
                <img
                  src={isDarkMode ? BingWhiteSvg : BingSvg}
                  alt="BING"
                  className="bing-icon"
                />
                BING
              </div>
            </div>

            {/* second line => "2.4 mi away" with road icon */}
            <div className="arcade-info-boxes">
              <div className="info-card" style={{ fontWeight: "normal" }}>
                <img
                  src={isDarkMode ? RoadWhiteSvg : RoadSvg}
                  alt="Road"
                  style={{ width: "16px", marginRight: "0.3rem" }}
                />
                2.4 mi away
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Times */}
      <div className="delivery-times-container">
        <div className="delivery-times-header">
          <p className="delivery-times-title">Delivery times</p>
          <span
            className="day-range"
            style={{ fontWeight: "normal", color: "var(--medium-grey)" }}
          >
            {currentDay} 6-11PM
          </span>
          <div className="time-carousel-controls">
            <button
              className="carousel-control"
              onClick={() => scrollTimes("left")}
            >
              &#10094;
            </button>
            <button
              className="carousel-control"
              onClick={() => scrollTimes("right")}
            >
              &#10095;
            </button>
          </div>
        </div>
        <div className="time-buttons" ref={timeCarouselRef}>
          {validHours.length === 0 ? (
            <p>No more deliveries today. Check back tomorrow!</p>
          ) : (
            validHours.map((hr, i) => {
              const label = convertTo12Hr(hr);
              const isClosest = hr === closestHour;
              return (
                <div className="time-slot" key={hr}>
                  <button
                    className={
                      i === 0
                        ? "time-btn gradient-swipe"
                        : "time-btn time-btn-other"
                    }
                  >
                    {label}
                  </button>
                  {isClosest && countdown && (
                    <p className="order-timer">order in {countdown}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Product Carousels */}
      <div className="products-section">
        <ProductCarousel title="Vapes" itemCount={6} />
        <ProductCarousel title="Edibles" itemCount={8} />
      </div>

      {/* #4: After "Edibles" => stack Just Breathe, cannabis store, divider, hours, map */}
      <div className="just-breathe-logo-home">
        <img
          src={DeliveryLogoSmallLavenderSrc}
          alt="Just Breathe"
          style={{ width: "60px" }}
        />
        <img
          src={JustBretheLogoWhiteSrc}
          alt="Just Breathe"
          style={{ width: "198px" }}
        />
        <p className="cannabis-store-subtitle" style={{ fontWeight: "normal" }}>
          cannabis store
        </p>
      </div>

      {/* Then the map */}
      <div className="map-section">
        <MapComponent />
      </div>

      {/* Then disclaimers at bottom */}
      <div className="home-disclaimer">
        <p>
          For use only by adults 21 years of age and older. Keep out of reach of
          children and pets. Please consume responsibly. There may be health
          risks associated with the consumption of this product.
        </p>
        <p style={{ marginTop: "1.5rem" }}>75 Court Street</p>
        <p>Binghamton, NY</p>
        <p style={{ marginTop: "1.5rem" }}>Sunday 12–6 PM</p>
        <p>Monday 10 AM–8 PM</p>
        <p>Tuesday 10 AM–8 PM</p>
        <p>Wednesday 10 AM–8 PM</p>
        <p>Thursday 10 AM–9 PM</p>
        <p>Friday 10 AM–10 PM</p>
        <p>Saturday 10 AM–9 PM</p>
      </div>

      {/* Floating cart widget */}
      <div className="floating-cart">
        <div className="cart-badge">0</div>
        <img src={cartIcon} alt="Cart" />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------
function convertTo12Hr(hour24: number): string {
  let suffix = "pm";
  let hour = hour24;
  if (hour24 === 0) {
    hour = 12;
    suffix = "am";
  } else if (hour24 < 12) {
    suffix = "am";
  } else if (hour24 > 12) {
    hour = hour24 - 12;
  }
  return `${hour}:00${suffix}`;
}

function calculateRemainingTime(targetHour: number): string {
  const now = new Date();
  const target = new Date();
  target.setHours(targetHour, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "00:00";

  const totalSecs = Math.floor(diff / 1000);
  if (totalSecs >= 3600) {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  } else {
    // under 1 hr => MM:SS
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  }
}

// -----------------------------------------------------------------
// PRODUCT CARD
//
// #3: Instead of day/night logic with theme, we always use:
//   0 => SunYellow,
//   1 => MoonBlue,
//   2 => Hybrid
// -----------------------------------------------------------------
function ProductCard({
  productKey,
  title = ".5G Vape Pen",
  category = "All-In-One",
  brand = "Ayrloom",
}: ProductCardProps) {
  // 0 => sun, 1 => moon, 2 => hybrid
  const randomRef = useRef<number | null>(null);
  if (randomRef.current === null) {
    randomRef.current = Math.floor(Math.random() * 3);
  }
  const productType = randomRef.current;

  let badgeIcon = HybridSvg; // default
  if (productType === 0) {
    badgeIcon = SunYellowSvg;
  } else if (productType === 1) {
    badgeIcon = MoonBlueSvg;
  }

  return (
    <div className="product-card" key={productKey}>
      <div className="product-badge">
        <img src={badgeIcon} alt="badge" />
      </div>
      <div className="product-card-inner">
        <div className="product-image-container">
          <img
            src="https://ayrloom.com/cdn/shop/files/ayr-vapes-cerealmilk-1g.png?v=1721221278"
            alt="Vape pen"
            className="product-image"
          />
        </div>
        <div className="product-info">
          <span className="product-category" style={{ fontWeight: "normal" }}>
            {category}
          </span>
          <h4 className="product-title">{title}</h4>
          <span className="product-brand" style={{ fontWeight: "normal" }}>
            {brand}
          </span>
        </div>
      </div>
      <div className="price-tag">
        <span className="price-tag-text">$35</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PRODUCT CAROUSEL
// -----------------------------------------------------------------
function ProductCarousel({ title, itemCount }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className="product-carousel-container">
      <div className="carousel-header">
        <h3 className="category-title">{title}</h3>
        <div className="carousel-controls">
          <button
            className="carousel-control carousel-control-left"
            onClick={() => scroll("left")}
          >
            &#10094;
          </button>
          <button
            className="carousel-control carousel-control-right"
            onClick={() => scroll("right")}
          >
            &#10095;
          </button>
        </div>
      </div>
      <div className="product-carousel" ref={carouselRef}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <ProductCard productKey={`${title}-${i}`} />
        ))}
      </div>
    </div>
  );
}

export default App;
