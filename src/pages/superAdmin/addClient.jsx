import React, { useEffect, useState } from 'react';
import '../../styles/index.scss';
import { PiUserCirclePlus } from 'react-icons/pi';
import { LiaEdit } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import API_BASE_URL from '../../config/Api';
import CommonForm from '../../components/CommonForm';

const AddClient = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const initialForm = {
        ClientId: '', CompanyName: '', FirstName: '', LastName: '', AdminEmail: '', Password: '',
        Address1: '', Address2: '', AboutUs: '', City: '', State: '', ZipCode: '', Phone: '',
        Mobile: '', Question: '', Answer: '', LicenseQty: '', Type: ''
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchAdmins = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/client-admins`)
            .then(res => res.json())
            .then(data => setAdmins(Array.isArray(data) ? data : []))
            .catch(err => setError('Error fetching client admins: ' + err.message))
            .finally(() => setLoading(false));
    };

    useEffect(fetchAdmins, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editIndex === null ? 'POST' : 'PUT';
        const url = `${API_BASE_URL}/client-admins${editIndex === null ? '' : '/' + admins[editIndex].id}`;
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save data');
            fetchAdmins();
            closeModal();
        } catch (err) {
            setFormError(err.message);
        }
    };

    const handleDelete = (index) => {
        if (!window.confirm('Are you sure?')) return;
        fetch(`${API_BASE_URL}/client-admins/${admins[index].id}`, { method: 'DELETE' })
            .then(res => res.ok && fetchAdmins())
            .catch(err => alert(err.message));
    };

    const openModal = (index = null) => {
        setFormData(index === null ? initialForm : admins[index]);
        setEditIndex(index);
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormError('');
        setFormData(initialForm);
        setEditIndex(null);
    };

    const adminFields = [
        'ClientId', 'CompanyName', 'FirstName', 'LastName', 'AdminEmail', 'Password',
        'Address1', 'Address2', 'AboutUs', 'City', 'State', 'ZipCode', 'Phone', 'Mobile',
        'Question', 'Answer', 'LicenseQty', 'Type'
    ].map(field => ({
        name: field,
        label: field.replace(/([A-Z])/g, ' $1').trim(),
        type: ['Address1', 'Address2', 'AboutUs'].includes(field) ? 'textarea' :
            ['ZipCode', 'Phone', 'Mobile', 'LicenseQty', 'Type'].includes(field) ? 'number' :
                field === 'AdminEmail' ? 'email' :
                    field === 'Password' ? 'password' : 'text'
    }));

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between mt-4 mb-3">
                <h3 className="text-primary">All Admins</h3>
                <button className="btn btn-outline-primary rounded-pill w-25" onClick={() => openModal()}>
                    Add client Admins <PiUserCirclePlus />
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading admins...</p> : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover clientTable">
                        <thead className="table-dark">
                            <tr>
                                {admins.length > 0 && Object.keys(admins[0]).filter(k => k !== 'Password').map(key => <th key={key}>{key}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin, i) => (
                                <tr key={admin.id || i}>
                                    {Object.keys(admin).filter(k => k !== 'Password').map(key => (
                                        <td key={key} title={admin[key]}>{admin[key]}</td>
                                    ))}
                                    <td>
                                        <button className="btn btn-outline-primary" onClick={() => openModal(i)}><LiaEdit /></button>
                                        <button className="btn btn-outline-danger" onClick={() => handleDelete(i)}><RiDeleteBinLine /></button>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && <tr><td colSpan="100%">No client admins found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editIndex === null ? 'Add New Client Admin' : 'Edit Client Admin'}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {formError && <div className="alert alert-danger">{formError}</div>}
                                    <CommonForm fields={adminFields} formData={formData} setFormData={setFormData} showSubmit={editIndex === null} />
                                </div>
                                {editIndex !== null && (
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="btn btn-outline-success">Update</button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddClient;