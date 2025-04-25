import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Fake login success
        if (email && password) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="loginRegister">
            <div className='LRContainer'>

                <div className="btns">
                    <button
                        className={`btn ${activeTab === 'login' ? 'active-btn' : 'inactive-btn'
                            }`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`btn ${activeTab === 'register' ? 'active-btn' : 'inactive-btn'
                            }`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {activeTab === 'login' && (
                    <div className="auth-container">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email" placeholder="Email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                            <br/>
                            <input
                                type="password" placeholder="Password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <br />
                            <button className='btn' type="submit">Login</button>
                        </form>
                    </div>
                )}

                {activeTab === 'register' && (
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-2">Register</h2>
                        <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Name" />
                        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" />
                        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Password" />
                        <button className="bg-green-600 text-white w-full p-2 rounded">Register</button>
                    </div>
                )}

            </div>
        </div>
    );
}
