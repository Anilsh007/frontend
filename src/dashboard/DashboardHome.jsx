import { useClient } from './ClientContext';
import dashboard_icon from '../assets/dashboard_icon.png';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { GiChaingun } from 'react-icons/gi';

export default function DashboardHome() {
  const { getAdminDetails } = useClient();

  const hours = new Date().getHours();
  let greet = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";


  return (
    <>
      <div className='bg-gredient'>
        <div className="row">
          <div className="col-xxl-6 col-sm-6 col-lg-6 col-md-12">
            <div className="py-4 px-5">
              <h6>{greet},</h6>
              <h2>{getAdminDetails.FirstName} {getAdminDetails.LastName}</h2>
              <p>{getAdminDetails.AboutUs}</p>
              <div className="mt-4 d-flex gap-5">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-gradient text-white p-3 rounded-3 me-3">
                    <GiChaingun />
                  </div>
                  <div className="d-flex flex-column">
                    <h2 className="m-0 lh-1">9</h2>
                    <p className="m-0">Vendors</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-gradient text-white p-3 rounded-3 me-3">
                    <HiOutlineUserGroup />
                  </div>
                  <div className="d-flex flex-column">
                    <h2 className="m-0 lh-1">3</h2>
                    <p className="m-0">Users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-sm-6 col-lg-6 col-md-12 text-center">
            <img src={dashboard_icon} alt={dashboard_icon} className="dashboard_icon img-fluid" />
          </div>
        </div>
      </div>
    </>
  );
}
