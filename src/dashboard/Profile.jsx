import { BsDatabaseAdd } from 'react-icons/bs';
import { useClient } from './ClientContext';

export default function Profile() {
  const { getAdminDetails } = useClient();

  if (!getAdminDetails) {
    return <div className="text-center mt-5 text-muted">Loading admin details...</div>;
  }

  return (
    <>

      <div className='clearfix mb-3'>
        <button className="btn btn-outline-primary mt-3 float-end mb-3">Update Details <BsDatabaseAdd /></button>
      </div>

      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
        <div>
          <h2>{getAdminDetails.FirstName} {getAdminDetails.LastName}</h2>
          <p>Email: <strong>{getAdminDetails.AdminEmail}</strong></p>
          <p>Client ID: <strong>{getAdminDetails.ClientId}</strong></p>
          <p>About Us: {getAdminDetails.AboutUs}</p>
        </div>
        <div>
          <img
            src={`https://api.cvcsem.com/uploads/${getAdminDetails.profileImage}` || "https://via.placeholder.com/100"}
            alt="Admin"
            className="img-thumbnail"
            style={{ maxWidth: '150px' }}
          />
        </div>
      </div>

      <div className="d-grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="p-3 bg-info text-white rounded">
          <h5>Contact Information</h5>
          <p>Phone: {getAdminDetails.Phone}</p>
          <p>Mobile: {getAdminDetails.Mobile}</p>
        </div>
        <div className="p-3 bg-success text-white rounded">
          <h5>Address</h5>
          <p>{getAdminDetails.Address1}, {getAdminDetails.Address2}</p>
          <p>{getAdminDetails.City}, {getAdminDetails.State} {getAdminDetails.ZipCode}</p>
        </div>
        <div className="p-3 bg-warning text-dark rounded">
          <h5>Company</h5>
          <p>Company Name: {getAdminDetails.CompanyName}</p>
          <p>License Quantity: {getAdminDetails.LicenseQty}</p>
        </div>
      </div>

      <div className="d-grid gap-4 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="p-3 bg-secondary text-white rounded">
          <h5>Security Question</h5>
          <p>Q: {getAdminDetails.Question}</p>
          <p>A: {getAdminDetails.Answer}</p>
        </div>
        <div className="p-3 bg-light rounded text-dark border">
          <h5>Identifiers</h5>
          <p>ID: {getAdminDetails.id}</p>
          <p>Type: {getAdminDetails.Type}</p>
        </div>
      </div>

      <div className="d-grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="text-center">
          <p className="text-muted">Company Logo</p>
          <img
            src={`https://api.cvcsem.com/uploads/${getAdminDetails.companylogo}`}
            alt="Company Logo"
            className="img-fluid border rounded"
            style={{ maxHeight: '150px' }}
          />
        </div>
        <div className="text-center">
          <p className="text-muted">Banner</p>
          <img
            src={`https://api.cvcsem.com/uploads/${getAdminDetails.baner}`}
            alt="Banner"
            className="img-fluid border rounded"
            style={{ maxHeight: '150px' }}
          />
        </div>
      </div>

    </>
  );
}
