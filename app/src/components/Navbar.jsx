function Navbar() {
  return (
    <nav className="navbar">
      <img src="/logo/noisy-logo.svg" className="logo-img"></img>
      <div className="navbar-buttons">
        <button className="icon-button">?</button>
        <button className="icon-button">≡</button>
      </div>
    </nav>
  );
}

export default Navbar;