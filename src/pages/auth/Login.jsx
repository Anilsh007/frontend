import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../../config/Api';
import { IoMdLogIn } from 'react-icons/io';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const credentials = {
      email: email.trim().toLowerCase(), // normalize email
      password: password.trim(),
    };

    try {
      let res, data;

      // 1. Try client-admin login
      res = await fetch(`${API_BASE_URL}/client-admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      data = await res.json();

      // 2. Try vendors login if Unauthorized
      if (!res.ok && res.status === 401) {
        res = await fetch(`${API_BASE_URL}/vendors/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        data = await res.json();

        // 3. Try clientUser login if still Unauthorized
        if (!res.ok && res.status === 401) {
          res = await fetch(`${API_BASE_URL}/clientUser/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          data = await res.json();

          if (!res.ok) throw new Error('Invalid email or password.');

          // Only Type 3 allowed for clientUser
          if (data.user?.Type !== 3) {
            throw new Error('Your account type is not authorized.');
          }
        } else if (!res.ok) {
          throw new Error('Invalid email or password.');
        }
      } else if (!res.ok) {
        throw new Error('Invalid email or password.');
      }

      // ✅ Successful login
      if (data.user) {
        const userType = data.user.Type;

        // Save minimal info to localStorage (never passwords)
        localStorage.setItem(
          'user',
          JSON.stringify({
            type: userType,
            sendAdminDetails: data.user,
            vendorCode: data.user.vendorcode,
            fullName: data.user.Fname + ' ' + data.user.Lname,
            clientId: data.user.ClientId,
          })
        );

        // Redirect based on user type
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
      console.error('Login error:', err); // log for dev only
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="overlay">
          <div className="spinner-border text-warning"></div>
        </div>
      )}

      <h3>Login</h3>

      <form onSubmit={handleSubmit}>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email</label>
          <input id="emailInput" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input id="passwordInput" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>

        <button type="submit" className="btn btn-outline-primary w-100"> LOG IN <IoMdLogIn /> </button>
      </form>

      <Link to="/forgot-password" className="d-block mt-2 text-center"> Forgot Password? Click Here </Link>
    </>
  );
}
