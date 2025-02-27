import { Link } from "react-router";
import "../Footer/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 |</p>
      <p>FridgeVentory |</p>
      <Link to="https://baileyleong.com">Bailey Leong</Link>
    </footer>
  );
};

export default Footer;
