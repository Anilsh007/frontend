import { FaRegUser } from 'react-icons/fa';
import { IoBookOutline, IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { NavLink, useOutletContext } from 'react-router-dom'; // ✅ use NavLink instead of Link
import logo from '../../src/assets/white.png';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { FaRegNoteSticky } from 'react-icons/fa6';

export default function Sidebar({SendClientId }) {

  const menuList = [
    {
      name: "Home",
      link: "DashboardHome",
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
      <div className="user-div">
        <FaRegUser/>
        <div className="user-detail">
          <h4>User name</h4>
          <h6>{typeof SendClientId === 'object'
              ? SendClientId.FirstName
              : SendClientId}</h6>
        </div>
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
