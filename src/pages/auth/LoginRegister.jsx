import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import darkLogo from '../../assets/dark.png';
import whiteLogo from '../../assets/white.png';

export default function LoginRegister() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Fake login success
        console.log(e);
        if (email && password) {
            navigate('/dashboard');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Fake login success
        if (email && password) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="loginRegister">

            <div>
                <img src={whiteLogo} alt="logo" className='w-25' />
            </div>


            <div className='LRContainer'>

                <div className="btns">
                    <button
                        className={`${activeTab === 'login' ? 'active-btn' : 'inactive-btn'
                            }`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`${activeTab === 'register' ? 'active-btn' : 'inactive-btn'
                            }`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {activeTab === 'login' && (
                    <div className="auth-container">
                        <form onSubmit={handleLogin}>
                            <div className="mb-3 mt-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" name="email" />
                            </div>

                            <div className="mb-3 mt-3">
                                <label htmlFor="email" className="form-label">Password:</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" name="password" />
                            </div>

                            <button type="submit" className="btn btn-outline-primary w-100">Login</button>
                        </form>
                    </div>
                )}

                {activeTab === 'register' && (
                    <div className="auth-container">
                        <form onSubmit={handleRegister}>
                            <div className="mb-3 mt-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setEmail(e.target.value)} placeholder="Enter name" name="name" />
                            </div>

                            <div className="mb-3 mt-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" name="email" />
                            </div>

                            <div className="mb-3 mt-3">
                                <label htmlFor="email" className="form-label">Password:</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" name="password" />
                            </div>

                            <button type="submit" className="btn btn-outline-primary w-100">Register</button>
                        </form>
                    </div>
                )}

            </div>
        </div>


    );
}
