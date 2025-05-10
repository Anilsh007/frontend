import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import whiteLogo from '../../assets/white.png';
import vendor_baner from '../../assets/vendor_banner.jpg';

export default function LoginRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { username } = useParams();
    const [userData, setUserData] = useState(null);

    // Vendor Registration States
    const [Fname, setFName] = useState('');
    const [Lname, setLName] = useState('');
    const [vendorEmail, setVendorEmail] = useState('');
    const [vendorPassword, setVendorPassword] = useState('');
    const [vendorRepassword, setVendorRepassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [vendorCity, setVendorCity] = useState('');
    const [vendorState, setVendorState] = useState('');
    const [vendorZipCode, setVendorZipCode] = useState('');
    const [vendorSUIN, setVendorSUIN] = useState('');
    const [vendorFIN, setVendorFIN] = useState('');
    const [vendorDUNS, setVendorDUNS] = useState('');
    const [vendorNAICS, setVendorNAICS] = useState('');
    const [vendorNIGP, setVendorNIGP] = useState('');
    const [vendorMobile, setVendorMobile] = useState('');
    const [vendorClassification1, setVendorClassification1] = useState('');
    const [vendorClassification2, setVendorClassification2] = useState('');
    const [vendorAnswer, setVendorAnswer] = useState('');

    useEffect(() => {
        if (username) {
            fetch(`http://localhost:5000/api/user/${username}`)
                .then((res) => res.json())
                .then((data) => setUserData(data))
                .catch((err) => console.error('Error fetching user:', err));
        }
    }, [username]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            navigate('/dashboard');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (
            Fname && Lname && vendorEmail && vendorPassword && vendorRepassword &&
            companyName && vendorAddress && vendorCity && vendorState && vendorZipCode &&
            vendorSUIN && vendorFIN && vendorDUNS && vendorNAICS && vendorNIGP &&
            vendorMobile && vendorClassification1 && vendorClassification2 && vendorAnswer
        ) {
            setShowModal(false);
            navigate('/dashboard');
        }
    };

    if (username && !userData) return <div>Loading...</div>;

    return (
        <div className="loginRegister">
            <div className='logo-div'>
                <div className="container">
                    <img src={whiteLogo} alt="logo" className='img-fluid'  />
                </div>
            </div>

            <img src={vendor_baner} alt="vendor_banner" className='vendor_baner img-fluid' />

            <div className="container">
                {username && userData && (
                    <div className='mt-5 mb-5 row'>
                        <div className='col-md-4'>
                            <img src="https://getrocketbook.com/cdn/shop/files/preview_images/e7814b42a8be4493ac1d766dbb2c31d1.thumbnail.0000000000.jpg?v=1709661942&width=1500" alt="" className='img-fluid rounded border' />
                        </div>
                        <div className='col-md-8'>
                            <p>{userData.description}</p>
                        </div>
                    </div>
                )}

                <hr />

                <div className="mt-5 row">
                    <div className="col-md-6 text-center">
                        <div className="form-div">
                            <h4>New Vendor Registration</h4>
                            <h6>Register your company</h6>
                            <button className='btn btn-outline-primary w-100' onClick={() => setShowModal(true)}>Register</button>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-div">
                            <h4>Login</h4>
                            <form onSubmit={handleLogin}>
                                <div className="mb-1 mt-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                                </div>

                                <div className="mb-3 mt-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                                </div>

                                <button type="submit" className="btn btn-outline-primary w-100">Login</button>
                                <p className='text-center mt-3 mb-0'><Link>Forgot Password? Click Here</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'hsla(0, 0.00%, 0.00%, 0.85)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content p-5">
                            <div className="modal-header">
                                <h5 className="modal-title">Vendor Information</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleRegister} className="row">
                                    {[['First Name', Fname, setFName], ['Last Name', Lname, setLName], ['Email ID', vendorEmail, setVendorEmail],
                                    ['Create Password', vendorPassword, setVendorPassword], ['Re-enter Password', vendorRepassword, setVendorRepassword],
                                    ['Company Name', companyName, setCompanyName], ['Address', vendorAddress, setVendorAddress],
                                    ['City', vendorCity, setVendorCity], ['State', vendorState, setVendorState], ['Zip Code', vendorZipCode, setVendorZipCode],
                                    ['SAM Unique Identicatification Number', vendorSUIN, setVendorSUIN],
                                    ['Federal Identification Number', vendorFIN, setVendorFIN], ['DUNS Number', vendorDUNS, setVendorDUNS],
                                    ['NAICS Codes', vendorNAICS, setVendorNAICS], ['NIGP Codes', vendorNIGP, setVendorNIGP], ['Vendor Mobile Number', vendorMobile, setVendorMobile]]
                                    .map(([label, value, setter], i) => (
                                        <div className="col-md-6 mb-2" key={i}>
                                            <label className="form-label">{label} <span className="text text-danger">*</span></label>
                                            <input type="text" className="form-control" value={value} onChange={e => setter(e.target.value)} required />
                                        </div>
                                    ))}

                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Small Business Classification <span className="text text-danger">*</span></label>
                                        <select className="form-control" value={vendorClassification1} onChange={e => setVendorClassification1(e.target.value)} required>
                                            <option value="">Select Classification</option>
                                            <option value="None">None</option>
                                            <option value="MBE">Minority Business Enterprise</option>
                                            <option value="WMBE">Women Owned Minority Business Enterprise</option>
                                            <option value="VOSB">Veteran Owned Small Business</option>
                                            <option value="SDVOSB">Service Disabled Veteran Owned Small Business</option>
                                            <option value="SDB">Small Disadvantaged Business</option>
                                            <option value="8a">SBA 8a Certified Business</option>
                                            <option value="HUB">HUB - Hubzone</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-2">
                                        <label className="form-label">Security Question <span className="text text-danger">*</span></label>
                                        <select className="form-control" value={vendorClassification2} onChange={e => setVendorClassification2(e.target.value)} required>
                                            <option value="">Select Question</option>
                                            <option value="pet">What is your pet's name?</option>
                                            <option value="mother">What is your mother's maiden name?</option>
                                            <option value="color">What is your favorite color?</option>
                                        </select>
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Security Answer <span className="text text-danger">*</span></label>
                                        <input className="form-control" value={vendorAnswer} onChange={e => setVendorAnswer(e.target.value)} required />
                                    </div>

                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-outline-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
