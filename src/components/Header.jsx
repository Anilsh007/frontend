import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../../src/assets/logo.png';

export default function Header({ clientLogo, passClientId, getClientId, onLoginStatusChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Safe parsing of user data
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Only allow expected fields
      if (parsed.type !== undefined && parsed.fullName && parsed.clientId) {
        user = parsed;
      }
    }
  } catch (e) {
    console.error('Error parsing user:', e);
    localStorage.removeItem('user');
  }

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (typeof onLoginStatusChange === "function") {
      onLoginStatusChange(isLoggedIn);
    }
  }, [isLoggedIn, onLoginStatusChange]);

  // Safe clientId fallback
  const safeClientId = passClientId || getClientId || null;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    // Prevent open redirect
    const safePath = safeClientId ? `/cvcsem/${encodeURIComponent(safeClientId)}` : '/';
    navigate(safePath, { replace: true });
  };

  // ------------------ Menu Definitions ------------------
  const homeMenu = [
    { name: 'Home', link: '/' },
    { name: 'Testimonials', link: '/testimonials' },
    { name: 'Blog', link: '/blog' },
    { name: 'Register', link: '/cvcsem/cvcsem' },
    { name: 'Login', link: '/login' },
  ];

  const vendorMenuBase = [
    { name: 'Events', link: '/events' },
    { name: 'Match Making', link: '/MyMatchMaking', state: safeClientId ? { passClientId: safeClientId } : undefined },
    { name: 'Register', link: '/vendorsRegister', state: safeClientId ? { passClientId: safeClientId } : undefined },
  ];

  const VendorDetailMenu = [...vendorMenuBase, { name: 'Logout', onClick: handleLogout }];
  const VendorDetailOutSide = [...vendorMenuBase, { name: 'Login', link: '/login' }];
  
  const adminMenu = [
    { name: 'Link 1', link: '/' },
    { name: 'link 2', link: '/' },
    { name: 'link 3', link: '/' },
    { name: 'Logout', onClick: handleLogout },
  ];

  // ------------------ Determine Slab ------------------
  let slab = 'home';
  if (path.startsWith('/dashboard')) slab = 'dashboard';
  else if (/^\/cvcsem\/[^/]+$/.test(path) || path.startsWith('/vendorsRegister') || path.startsWith('/MyMatchMaking') || path.startsWith('/QuickVendorsRegister') || path.startsWith('/BookMatchMaking')) slab = 'vendor';

  // ------------------ Determine Menu ------------------
  let menuToRender = homeMenu;
  switch (slab) {
    case 'dashboard':
      menuToRender = adminMenu;
      break;
    case 'vendor':
      menuToRender = user ? VendorDetailMenu : VendorDetailOutSide;
      break;
    default:
      menuToRender = homeMenu;
  }

  // ------------------ Render ------------------
  return (
    <header className="App_header">
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container-fluid">
          <div className="logo-div">
            <NavLink to="/" className="navbar-brand">
              <img src={clientLogo || logo} alt="logo" className="img-fluid" />
            </NavLink>
          </div>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
            <ul className="navbar-nav">
              {menuToRender.map((item, idx) => (
                <li key={idx} className="nav-item">
                  {item.onClick ? (
                    <NavLink
                      to={item.link || '#'}
                      type="button"
                      onClick={item.onClick}
                      className={({ isActive }) => (isActive ? 'nav-link active-menu' : 'nav-link')}
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={item.link || '#'}
                      {...(item.state ? { state: item.state } : {})}
                      className={({ isActive }) => (isActive ? 'nav-link active-menu' : 'nav-link')}
                    >
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
