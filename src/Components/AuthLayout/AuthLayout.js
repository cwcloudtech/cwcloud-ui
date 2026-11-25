import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import GlobalContext from "../../Context/GlobalContext";
import Translate from "../Translate/Translate";
import logoimage, { isExternalLogo } from "../../utils/customizedLogo";
import lightLogo from "../../assets/images/cwcloud-whitemode.png";
import darkLogo from "../../assets/images/cwcloud-darkmode.png";
import Illustration from "../../assets/images/background.png";
import "./AuthLayout.css";

const docUrl = process.env.REACT_APP_DOCURL;

/**
 * The frame every signed-out screen sits in (same UX as strong-fish): the
 * illustration on a navy panel filling the left half, the form in a card on
 * the right. The headline over the art is real, translated text. Below the
 * breakpoint the art is dropped and the card sits on the navy gradient.
 */
export default function AuthLayout({ children }) {
  const context = useContext(GlobalContext);
  const isDark = context.mode === "dark";
  const isFrench = context.language === "fr";

  return (
    <div className="cw-auth">
      <aside className="cw-auth-art" aria-hidden="false">
        <img className="cw-auth-art-illustration" src={Illustration} alt="" loading="eager" />
        <div className="cw-auth-art-content">
          <h2>
            <Translate content="intro.heroTitle" />
          </h2>
          <p>
            <Translate content="intro.presentation" />.{" "}
            <Translate content="intro.wiki.part1" />{" "}
            <a href={docUrl} target="_blank" rel="noreferrer">
              <Translate content="intro.wiki.part2" />
            </a>
            .
          </p>
        </div>
      </aside>

      <main className="cw-auth-panel">
        <div className="cw-auth-card">
          <Link to="/" className={`cw-auth-logo-link ${isExternalLogo() ? "cw-auth-logo-badge" : ""}`} aria-label="CWCloud">
            <img className="cw-auth-logo" src={logoimage(isDark ? darkLogo : lightLogo)} alt="CWCloud" />
          </Link>
          {children}

          <div className="cw-auth-footer">
            <Link to="/contact">
              <Translate content="login.contact" />
            </Link>
            {docUrl && (
              <a href={docUrl} target="_blank" rel="noreferrer">
                <Translate content="intro.wiki.part2" />
              </a>
            )}
            <button
              type="button"
              className="cw-auth-footer-button"
              onClick={() => context.setLanguage(isFrench ? "en" : "fr")}
              aria-label={isFrench ? "Switch to English" : "Passer en français"}
              title={isFrench ? "English" : "Français"}
            >
              {isFrench ? "EN" : "FR"}
            </button>
            <button
              type="button"
              className="cw-auth-footer-button"
              onClick={() => context.setMode(isDark ? "light" : "dark")}
              aria-label={isDark ? "Light mode" : "Dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
