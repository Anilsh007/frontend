import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../src/assets/white.png';

export default function Header({ clientLogo, passClientId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Matches /cvcsem/ or /dashboard/ 
  const isVendorPage = /^\/cvcsem\/[^/]+$/.test(path);
  const isDashboard = path.startsWith('/dashboard');
  const isVendorDetail = path.startsWith('/VendorDetail');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/');
  };

  const homeMenu = [
    { name: 'Home', link: '/' },
    { name: 'Testimonials', link: '/testimonials' },
    { name: 'Blog', link: '/blog' },
    { name: 'Register', link: 'cvcsem/cvcsem' },
    { name: 'Login', link: '/login' },
  ];

  const vendorMenu = [
    { name: 'Register', link: '/vendorsRegister', state: { passClientId } },
    { name: 'Login', link: '/login' },
  ];

  const VendorDetailMenu = [
    { name: 'Link 1', link: '' },
    { name: 'Link 2', link: '' },
    { name: 'Link 3', link: '' },
    { name: 'Logout', onClick: handleLogout },
  ];

  const adminMenu = [
    { name: 'Link 1', link: '' },
    { name: 'Link 2', link: '' },
    { name: 'Link 3', link: '' },
    { name: 'Logout', onClick: handleLogout },
  ];

  const menuToRender = isDashboard ? adminMenu : isVendorPage ? vendorMenu : isVendorDetail ? VendorDetailMenu : homeMenu;

  return (
    <header className="App_header">
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container-fluid">
          <div className="logo-div">
            <NavLink to="/" className="navbar-brand">
              <img src={clientLogo || logo} alt="logo" className="img-fluid" />
            </NavLink>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
            <ul className="navbar-nav">
              {menuToRender.map((item, index) => (
                <li key={index} className="nav-item">
                  {item.onClick ? (
                    <NavLink onClick={item.onClick} className="nav-link active-menu">
                      {item.name}
                    </NavLink>
                  ) : (
                    <NavLink
                      to={item.link}
                      {...(item.state ? { state: item.state } : {})}
                      className={({ isActive }) => isActive ? 'nav-link active-menu' : 'nav-link'}
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
