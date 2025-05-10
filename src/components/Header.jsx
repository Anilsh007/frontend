import { NavLink } from 'react-router-dom';
import logo from '../../src/assets/white.png';

export default function Header() {

  const header_Menu = [
    {
      name: "Add Client",
      link: "addClient"
    },
    {
      name: "Testimonials",
      link: "testimonials"
    },
    {
      name: "Blog",
      link: "blog"
    }
  ]
  return (
    <header className="App_header">
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container">
          <div className="logo-div">
            <img src={logo} alt="logo" className='img-fluid' />
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
            <ul>
              {header_Menu.map((item, index) => (
                <li key={index}>
                  <NavLink to={`/${item.link}`} className={({ isActive }) => isActive ? 'active-menu' : ''}>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))

              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
