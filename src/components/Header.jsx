import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/white.png';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user'); // Check login status

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/'); // Redirect after logout
  };

  const guest_Menu = [
    // {
    //   name: "Add Client",
    //   link: "addClient"
    // },
    {
      name: "Testimonials",
      link: "testimonials"
    },
    {
      name: "Blog",
      link: "blog"
    },
    {
      name: "Register",
      link: "Register"
    },
    {
      name: "Login",
      link: "Login"
    }
  ];

  return (
    <header className="App_header">
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container">
          <div className="logo-div">
            <NavLink to="/" className="navbar-brand">
              <img src={logo} alt="logo" className='img-fluid' />
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
            <ul>
              {!isLoggedIn ? (
                guest_Menu.map((item, index) => (
                  <li key={index}>
                    <NavLink to={`/${item.link}`} className={({ isActive }) => (isActive ? 'active-menu' : '')} ><span>{item.name}</span></NavLink>
                  </li>
                ))
              ) : (
                <li>
                  <button onClick={handleLogout} style={{ textDecoration: 'none' }} >Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
