import { useEffect, useState } from "react";
import { PiUserCirclePlus } from "react-icons/pi";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

export default function AddclientAdmin() {
    const [allAdmins, setallAdmins] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // All form fields
    const [clientAdminFname, setclientAdminFname] = useState('');
    const [clientAdminLname, setclientAdminLname] = useState('');
    const [clientAdminEmail, setclientAdminEmail] = useState('');
    const [clientAdminPassword, setclientAdminPassword] = useState('');
    const [clientAdminRepassword, setclientAdminRepassword] = useState('');
    const [clientAdmincompanyName, setclientAdmincompanyName] = useState('');
    const [clientAdminAddress, setclientAdminAddress] = useState('');
    const [clientAdminCity, setclientAdminCity] = useState('');
    const [clientAdminState, setclientAdminState] = useState('');
    const [clientAdminZipCode, setclientAdminZipCode] = useState('');
    const [clientAdminNumber, setclientAdminNumber] = useState('');
    const [clientAdminQuestions, setclientAdminQuestions] = useState('');
    const [clientAdminLAnswer, setclientAdminLAnswer] = useState('');

    const fetchAdmins = () => {
        fetch('http://localhost:5000/api/admin')
            .then((res) => res.json())
            .then((data) => {
                setallAdmins(data);
                setError('');
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch admins');
            });
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const resetForm = () => {
        setclientAdminFname('');
        setclientAdminLname('');
        setclientAdminEmail('');
        setclientAdminPassword('');
        setclientAdminRepassword('');
        setclientAdmincompanyName('');
        setclientAdminAddress('');
        setclientAdminCity('');
        setclientAdminState('');
        setclientAdminZipCode('');
        setclientAdminNumber('');
        setclientAdminQuestions('');
        setclientAdminLAnswer('');
    };

    const ClientAdminRegister = (e) => {
        e.preventDefault();

        const data = {
            clientAdminFname, clientAdminLname, clientAdminEmail, clientAdminPassword,
            clientAdminRepassword, clientAdmincompanyName, clientAdminAddress, clientAdminCity,
            clientAdminState, clientAdminZipCode, clientAdminNumber, clientAdminQuestions, clientAdminLAnswer
        };

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `http://localhost:5000/api/admin/${editingId}`
            : 'http://localhost:5000/api/admin';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message || (editingId ? "Admin updated" : "Admin added"));
                setShowModal(false);
                setEditingId(null);
                resetForm();
                fetchAdmins();
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to submit");
            });
    };

    const handleEdit = (admin) => {
        setclientAdminFname(admin.clientAdminFname);
        setclientAdminLname(admin.clientAdminLname);
        setclientAdminEmail(admin.clientAdminEmail);
        setclientAdminPassword(admin.clientAdminPassword);
        setclientAdminRepassword(admin.clientAdminRepassword);
        setclientAdmincompanyName(admin.clientAdmincompanyName);
        setclientAdminAddress(admin.clientAdminAddress);
        setclientAdminCity(admin.clientAdminCity);
        setclientAdminState(admin.clientAdminState);
        setclientAdminZipCode(admin.clientAdminZipCode);
        setclientAdminNumber(admin.clientAdminNumber);
        setclientAdminQuestions(admin.clientAdminQuestions);
        setclientAdminLAnswer(admin.clientAdminLAnswer);
        setEditingId(admin.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            fetch(`http://localhost:5000/api/admin/${id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then((data) => {
                    alert(data.message || "Admin deleted.");
                    fetchAdmins();
                })
                .catch((err) => {
                    console.error(err);
                    alert("Failed to delete admin");
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between mt-4 mb-3">
                <h3 className="text-primary">All Admins</h3>
                <button className="btn btn-outline-primary rounded-pill" onClick={() => {
                    resetForm();
                    setEditingId(null);
                    setShowModal(true);
                }}>
                    Add clientAdmins <PiUserCirclePlus />
                </button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>First / Last Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Re-Password</th>
                            <th>Company Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Zip code</th>
                            <th>Contact Number</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAdmins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.clientAdminFname} {admin.clientAdminLname}</td>
                                <td>{admin.clientAdminEmail}</td>
                                <td>{admin.clientAdminPassword}</td>
                                <td>{admin.clientAdminRepassword}</td>
                                <td>{admin.clientAdmincompanyName}</td>
                                <td>{admin.clientAdminAddress}</td>
                                <td>{admin.clientAdminCity}</td>
                                <td>{admin.clientAdminState}</td>
                                <td>{admin.clientAdminZipCode}</td>
                                <td>{admin.clientAdminNumber}</td>
                                <td>{admin.clientAdminQuestions}</td>
                                <td>{admin.clientAdminLAnswer}</td>
                                <td className="d-flex">
                                    <button className="btn btn-outline-warning me-2" onClick={() => handleEdit(admin)}><LiaEdit/></button>
                                    <button className="btn  btn-outline-danger" onClick={() => handleDelete(admin.id)}><RiDeleteBinLine /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content p-3">
                            <form onSubmit={ClientAdminRegister} className="row p-3">
                                <div className="modal-header col-12">
                                    <h5 className="modal-title text-primary">{editingId ? 'Edit Admin' : 'Add Admin'}</h5>
                                    <button type="button" className="btn-close" onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        resetForm();
                                    }}></button>
                                </div>

                                {[
                                    ['First Name', 'text', clientAdminFname, setclientAdminFname],
                                    ['Last Name', 'text', clientAdminLname, setclientAdminLname],
                                    ['Email ID', 'email', clientAdminEmail, setclientAdminEmail],
                                    ['Create Password', 'password', clientAdminPassword, setclientAdminPassword],
                                    ['Re-enter Password', 'password', clientAdminRepassword, setclientAdminRepassword],
                                    ['Company Name', 'text', clientAdmincompanyName, setclientAdmincompanyName],
                                    ['Address', 'text', clientAdminAddress, setclientAdminAddress],
                                    ['City', 'text', clientAdminCity, setclientAdminCity],
                                    ['State', 'text', clientAdminState, setclientAdminState],
                                    ['Zip Code', 'number', clientAdminZipCode, setclientAdminZipCode],
                                    ['Company Phone Number', 'number', clientAdminNumber, setclientAdminNumber],
                                ].map(([label, type, value, setter], i) => (
                                    <div className="col-md-6 mb-2" key={i}>
                                        <label className="form-label">{label} <span className="text-danger">*</span></label>
                                        <input type={type} className="form-control" value={value} onChange={e => setter(e.target.value)} required />
                                    </div>
                                ))}

                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Security Question <span className="text-danger">*</span></label>
                                    <select className="form-control" value={clientAdminQuestions} onChange={e => setclientAdminQuestions(e.target.value)} required>
                                        <option value="">Select Question</option>
                                        <option value="Question 1">Question 1</option>
                                        <option value="Question 2">Question 2</option>
                                        <option value="Question 3">Question 3</option>
                                        <option value="Question 4">Question 4</option>
                                        <option value="Question 5">Question 5</option>
                                        <option value="Question 6">Question 6</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Security Answer <span className="text-danger">*</span></label>
                                    <input className="form-control" value={clientAdminLAnswer} onChange={e => setclientAdminLAnswer(e.target.value)} required />
                                </div>

                                <div className="col-md-12 mb-3 d-flex">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill w-50 me-2" onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        resetForm();
                                    }}>Cancel</button>
                                    <button type="submit" className="btn btn-outline-primary rounded-pill w-50">
                                        {editingId ? 'Update' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
