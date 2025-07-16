import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../../config/Api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };

    let data = null;
    let res = null;

    try {
      // 1. Try client-admins/login
      res = await fetch(`${API_BASE_URL}/client-admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      data = await res.json();

      // 2. If Unauthorized, try vendors/login
      if (!res.ok && res.status === 401) {
        console.warn('Trying vendors/login...');
        res = await fetch(`${API_BASE_URL}/vendors/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        data = await res.json();

        // 3. If still Unauthorized, try clientUser/login
        if (!res.ok && res.status === 401) {
          console.warn('Trying clientUser/login...');
          res = await fetch(`${API_BASE_URL}/clientUser/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          data = await res.json();

          if (!res.ok) throw new Error(data.message || 'Login failed');

          // Check if Type is exactly 3 for clientUser
          if (data.user?.Type !== 3) {
            throw new Error('Only user type 3 is allowed from this login.');
          }
        } else if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }
      } else if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ If login is successful
      if (data.user) {
        const userType = data.user.Type;

        localStorage.setItem('user', JSON.stringify({
          type: userType,
          sendAdminDetails: data.user,
          vendorCode: data.user.vendorcode,
        }));

        if (userType === 1 || userType === 3) {
          navigate('/dashboard');
        } else if (userType === 2) {
          navigate('/VendorDetail', { state: { vendorcode: data.user.vendorcode } });
        } else if (userType === 0) {
          setErrorMsg('Your account is not authorized to log in.');
        } else {
          setErrorMsg('Unknown user type.');
        }
      }

    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      console.error('Login error:', err);
    }
  };



  return (
    <>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        <div className="mb-3">
          <label className="form-label" htmlFor="emailInput">Email</label>
          <input id="emailInput" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="passwordInput">Password</label>
          <input id="passwordInput" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        <button className="btn btn-outline-primary w-100" type="submit">LOG IN</button>
      </form>
      <Link to="/forgot-password" className="d-block mt-2 text-center">Forgot Password? Click Here</Link>
    </>
  );
}
