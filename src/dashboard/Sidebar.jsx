import { FaRegUser } from 'react-icons/fa';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom'; // ✅ use NavLink instead of Link
import { GiChaingun } from "react-icons/gi";
import { FaRegNoteSticky } from 'react-icons/fa6';
import { HiOutlineUserGroup } from "react-icons/hi";

export default function Sidebar({adminData }) {
  const menuList = [
    {
      name: "Home",
      link: "DashboardHome",
      icon: <IoHomeOutline />
    },
    {
      name: "Users",
      link: "ClientUser",
      icon: <HiOutlineUserGroup />
    },
    {
      name: "Vendors",
      link: "AdminVendors",
      icon: <GiChaingun />
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
        <>{
          adminData && adminData.profileImage ? (
            <img src={`https://api.cvcsem.com/uploads/${adminData.profileImage}`} alt="Logo" className="sidebar-profile" />
          ) : (
            <FaRegUser/>
          )
        }
        </>
        
        <div className="user-detail">
          <h4>{adminData.FirstName} {adminData.LastName}</h4>
          <h6>{adminData.ClientId}</h6>
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
