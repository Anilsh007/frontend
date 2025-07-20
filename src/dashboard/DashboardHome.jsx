import { useClient } from './ClientContext';
import dashboard_icon from '../assets/dashboard_icon.png';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { GiChaingun } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/Api';

export default function DashboardHome() {
  const { getAdminDetails } = useClient();
  const [vendorCount, setVendorCount] = useState(0);
  const [userCount, setUserCount] = useState(0); // Placeholder if needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Dashboard Home Admin Data:", getAdminDetails.Type);

  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    const fetchVendorCount = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientId = getAdminDetails?.ClientId;
        if (!clientId) throw new Error("Client ID missing");

        const res = await axios.get(`${API_BASE_URL}/vendors/searchVendor/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : [res.data];
        setVendorCount(data.length);
      } catch (err) {
        console.error("Vendor fetch error:", err);
        setError("Failed to load vendor count");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserCount = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientId = getAdminDetails?.ClientId;
        if (!clientId) throw new Error("Client ID missing");

        const res = await axios.get(`${API_BASE_URL}/clientUser/searchUser/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : [res.data];
        setUserCount(data.length);
      } catch (err) {
        console.error("Vendor fetch error:", err);
        setError("Failed to load vendor count");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorCount();
    fetchUserCount();
  }, [getAdminDetails]);

  return (
    <div className='bg-gredient'>
      <div className="row">
        <div className="col-xxl-6 col-sm-6 col-lg-6 col-md-12">
          <div className="py-4 px-5">
            <h6>{greet},</h6>
            <h2>{getAdminDetails.FirstName} {getAdminDetails.LastName}</h2>
            <p>{getAdminDetails.AboutUs}</p>

            {loading ? (
              <div className="mt-4">Loading vendor data...</div>
            ) : error ? (
              <div className="alert alert-danger mt-4">{error}</div>
            ) : (
              <div className="mt-4 d-flex gap-5">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-gradient text-white p-3 rounded-3 me-3">
                    <GiChaingun />
                  </div>
                  <div className="d-flex flex-column">
                    <h2 className="m-0 lh-1">{vendorCount}</h2>
                    <p className="m-0">Vendors</p>
                  </div>
                </div>

                {(getAdminDetails?.Type === 1 || getAdminDetails?.Type === 2) && (
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-gradient text-white p-3 rounded-3 me-3">
                      <HiOutlineUserGroup />
                    </div>
                    <div className="d-flex flex-column">
                      <h2 className="m-0 lh-1">{userCount}</h2>
                      <p className="m-0">Users</p>
                    </div>
                  </div>
                )}
              </div>

            )}
          </div>
        </div>
        <div className="col-xxl-6 col-sm-6 col-lg-6 col-md-12 text-center">
          <img src={dashboard_icon} alt="dashboard icon" className="dashboard_icon img-fluid" />
        </div>
      </div>
    </div>
  );
}
