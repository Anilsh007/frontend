import { FaRegUser } from 'react-icons/fa';
import { IoHomeOutline, IoSettingsOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { GiChaingun } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosArrowDropleft } from "react-icons/io";
import { useState } from 'react';
import { TbTimelineEvent } from "react-icons/tb";
import { FaRegHandshake } from "react-icons/fa";

export default function Sidebar({ adminData }) {

  const [collapsed, setCollapsed] = useState(false);
  const ToggleEvent = () => {
    setCollapsed(prev => !prev);
  };

  const fullMenuList = [
    {
      name: "Home",
      link: "DashboardHome",
      icon: <IoHomeOutline />
    },
    {
      name: "Users",
      link: "ClientUser",
      icon: <HiOutlineUserGroup />,
      hiddenForType3: true // mark it for conditional removal
    },
    {
      name: "Vendors",
      link: "AdminVendors",
      icon: <GiChaingun />
    },
    {
      name: "Profile",
      link: "profile",
      icon: <FaRegUser />
    },
    {
      name: "Events",
      link: "Events",
      icon: <TbTimelineEvent />
    },
    {
      name: "Match making",
      link: "CreateMatchmaking",
      icon: <FaRegHandshake  />
    }
  ];

  // Filter the menu based on adminData.Type
  const menuList = fullMenuList.filter(item => !(adminData?.Type === 3 && item.hiddenForType3));

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="user-div">
        {
          adminData && adminData.profileImage ? (
            <img src={`https://api.cvcsem.com/uploads/${adminData.profileImage}`} alt="Logo" className="sidebar-profile" />
          ) : (
            <FaRegUser />
          )
        }

        <div className="user-detail">
          <h6 className='mb-0'>
            {adminData.FirstName && adminData.LastName
              ? `${adminData.FirstName} ${adminData.LastName}`
              : adminData.Fname}
          </h6>
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

      <IoIosArrowDropleft className="collpase-Btn" onClick={ToggleEvent} />
    </div>
  );
}
