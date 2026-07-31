import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/logo/noisy-logo.svg" alt="noisy" className="logo-img" />
      </Link>
      <div className="navbar-buttons">
        <Link to="/about" className="icon-button">?</Link>
        <button className="icon-button">≡</button>
      </div>
    </nav>
  );
}

export default Navbar;