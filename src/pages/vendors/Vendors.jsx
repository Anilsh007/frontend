import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoginRegister from './VendorsRegister';
import API_BASE_URL from '../../config/Api';
import Login from '../auth/Login';
import Header from '../../components/Header';

export default function Vendors() {
    const { ClientId } = useParams(); // Get ClientId from URL
    const [adminData, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/client-admins/client/${ClientId}`);
                if (!response.ok) {
                    throw new Error('No admin found for this ClientId.');
                }
                const data = await response.json();
                setAdmin(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (ClientId) {
            fetchAdminData();
        }
    }, [ClientId]);

    return (
        <>
            <Header />
            <img
                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/1512c63e-a44e-48e8-92d6-51d80a43cc1e/dezucd8-a4dbad47-4a29-4065-b129-5cdcb64afcf4.png"
                className="img-fluid vendor-baner"
                alt="Vendor Banner"
            />

            <div className="container mt-5 border-bottom pb-5">

                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div>Loading <div className="spinner-border text-primary"></div></div>}

                {adminData && (
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={adminData.ProfileImage || 'https://img.freepik.com/premium-vector/neon-frame-template-with-placeholder-blue-incline-light-banner-design-template-glowing-rectangle-signboard_134815-320.jpg'}
                                alt="Admin Profile"
                                className="img-fluid"
                            />
                        </div>
                        <div className="col-md-8">
                            <p>{adminData.AboutUs}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="LRbox d-flex justify-content-around mb-1">
                <div className="box text-center border p-5 rounded">
                    <LoginRegister passClientId={ClientId} />
                </div>

                <div className="box text-center border p-5 rounded">
                    <Login />
                </div>
            </div>

        </>
    );
}