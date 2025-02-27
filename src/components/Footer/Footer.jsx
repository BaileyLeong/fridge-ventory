import { Link } from "react-router";
import "../Footer/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <span className="footer__left">
          <p>&copy; 2025</p>
          <p>|</p>
          <p>Fridge-Ventory</p>
          <p>|</p>
          <a
            href="https://baileyleong.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Bailey Leong
          </a>
        </span>
        <span className="footer__right">
          <a
            href="https://github.com/BaileyLeong"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <p>|</p>
          <a
            href="https://www.linkedin.com/in/bailey-leong"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Linkedin
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
