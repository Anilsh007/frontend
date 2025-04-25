import { FaRegUser } from 'react-icons/fa';
import { IoBookOutline, IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom'; // ✅ use NavLink instead of Link
import logo from '../../src/assets/logo.png';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { FaRegNoteSticky } from 'react-icons/fa6';

export default function Sidebar() {
  const menuList = [
    {
      name: "Home",
      link: "home",
      icon: <IoHomeOutline />
    },
    {
      name: "About",
      link: "about",
      icon: <IoBookOutline />
    },
    {
      name: "Feature",
      link: "feature",
      icon: <MdOutlineFeaturedPlayList />
    },
    {
      name: "Testimonial",
      link: "testimonial",
      icon: <FaRegNoteSticky/>
    },
    {
      name: "Profile",
      link: "profile",
      icon: <FaRegUser />
    },
    {
      name: "Settings",
      link: "settings",
      icon: <IoSettingsOutline />
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <ul>
        {menuList.map((item, index) => (
          <li key={index}>
            <NavLink
              to={`/dashboard/${item.link}`}
              className={({ isActive }) => isActive ? 'active-menu' : ''}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
