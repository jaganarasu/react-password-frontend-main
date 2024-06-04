import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RingLoader } from 'react-spinners'; // Import the spinner component
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    mobileNumber: '',
    avatar: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [avatarList, setAvatarList] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('https://password-reset-backend-main-huso.onrender.com/api/avatars');
        const data = await response.json();
        setAvatarList(data.avatars);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch avatars');
      }
    };

    fetchAvatars();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(e.target.value)) {
        setPasswordError(
          'Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character'
        );
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      setLoading(true); 

      const response = await fetch('https://password-reset-guvi.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Sign up successful');
        navigate('/login');
      } else {
        toast.error('Sign up failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="fw-bold text-white form-container">
        <h1 className='text-center mb-4'>Sign Up</h1>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="userName"
            name="userName"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">
            Mobile Number
          </label>
          <input
            type="text"
            className="form-control"
            id="mobileNumber"
            name="mobileNumber"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
          {passwordError && <p className="text-danger">{passwordError}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">
            Select Avatar
          </label>
          <select
            className="form-select"
            id="avatar"
            name="avatar"
            onChange={handleChange}
            required
          >
            <option value="">Select an avatar</option>
            {avatarList.map((avatar) => (
              <option key={avatar._id} value={avatar.link}>
                {avatar.name}
              </option>
            ))}
          </select>
        </div>
        <div className='text-center'>
          <button type="submit" className="btn w-50 fw-bold btn-primary btn-submit">
            {loading ? (
              <RingLoader color={'#36D7B7'} loading={loading} size={30} />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;