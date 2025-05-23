import React, { useEffect, useRef, useState } from 'react';
import styles from './LoginForm.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MessageModel from '../Models/MessageModel';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import CountdownTimer from '../Exam/CountdownTimer';
import SpinnerComponent from '../common/spinner/SpinnerComponent';

const LoginForm = () => {
  const router = useRouter();

  const [showIcon, setShowIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    cnf_password: ''
  });
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [canResend, setCanResend] = useState(false);
  const input_ref = useRef<(HTMLInputElement | null)[]>([]);

  const handleShowPassword = () => setShowIcon(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    // if (changePassword && !formData.username || !formData.password ) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const result = await response.json();
      setLoading(false);

      if (response.status !== 200) {
        setMessage(result.error || 'Login failed');
        setMessageType('error');
        setShowModel(true);
      } else {
        setMessage(result.message || 'OTP sent');
        setMessageType('success');
        setShowModel(true);
        setShowOtp(true);
      }
    } catch (error: any) {
      setLoading(false);
      setMessage('Something went wrong');
      setMessageType('error');
      setShowModel(true);
      console.error(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) input_ref.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      input_ref.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      input_ref.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      input_ref.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').trim();
    const otpArray = pastedData.split('').slice(0, otp.length);
    const updatedOtp = [...otp];

    otpArray.forEach((char, i) => {
      if (!isNaN(Number(char))) {
        updatedOtp[i] = char;
      }
    });

    setOtp(updatedOtp);
    input_ref.current[Math.min(otpArray.length, otp.length - 1)]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent, resend: boolean) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resend,
          otp: otp.join(''),
          username: formData.username,
          password: formData.password
        })
      });

      const result = await response.json();
      setLoading(false);

      if (response.status !== 200) {
        setMessage(result.error || 'OTP verification failed');
        setMessageType('error');
        setShowModel(true);
      } else {
        if (changePassword) {
          setMessage('Update the password');
          setMessageType('success');
          setShowModel(true);
          setShowPasswordModal(true);
        } else {
          setMessage(result.message || 'Login successful');
          Cookies.set('username', formData.username, { expires: 0.0208 });
          router.push('/subjects');
          setMessageType('success');
          setShowModel(true);
        }
      }
    } catch (error: any) {
      setLoading(false);
      setMessage('Something went wrong');
      setMessageType('error');
      setShowModel(true);
      console.error(error.message);
    }
  };

  const handleReSend = () => {
    sendOtp();
    setCanResend(false);
  };

  const handleForgetPassword = () => {
    if (formData.username) {
      sendOtp();
    } else {
      setMessage('Please enter a valid Email');
      setMessageType('error');
      setShowModel(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.cnf_password) {
      setMessage('Confirm password should match');
      setMessageType('error');
      setShowModel(true);
      return;
    }

    try {
      const response = await fetch(`/api/user`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.status !== 200) {
        setMessage(result.error || 'Update failed');
        setMessageType('error');
        setShowModel(true);
      } else {
        setMessage('Password updated successfully');
        setMessageType('success');
        setShowModel(true);
        router.push('/login');
      }
    } catch (error: any) {
      setMessage('Something went wrong');
      setMessageType('error');
      setShowModel(true);
      console.error(error.message);
    }
  };

  const OtpComponent = () => (
    <>
      <div className={styles['card-header']}>OTP Verification</div>
      <div className="card-body">
        <form onSubmit={(e) => handleOtpSubmit(e, true)} style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => {
                  input_ref.current[index] = el;
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  fontSize: '24px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            ))}
          </div>
          <button type="submit" className={`btn btn-primary btn-block ${styles['btn-primary']}`}>
            Verify OTP
          </button>
          <p className="text-end mt-2">
            <a
              onClick={handleReSend}
              className={`ms-1 text-decoration-none ${canResend ? 'text-primary' : 'text-secondary'}`}
              style={{ cursor: canResend ? 'pointer' : 'not-allowed' }}
            >
              Resend OTP{' '}
              {!canResend && <CountdownTimer duration={100} onComplete={() => setCanResend(true)} />}
            </a>
          </p>
        </form>
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {loading && <SpinnerComponent />}

        {showOtp ? (
          !showPasswordModal ? (
            OtpComponent()
          ) : (
            <>
              <div className={styles['card-header']}>Update Password</div>
              <div className="card-body">
                <form onSubmit={handleUpdatePassword}>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${styles['form-control']}`}
                      id="password"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cnf_password">Confirm Password</label>
                    <input
                      type="password"
                      name="cnf_password"
                      value={formData.cnf_password}
                      onChange={handleChange}
                      className={`form-control ${styles['form-control']}`}
                      id="cnf_password"
                      placeholder="Enter confirmation password"
                      required
                    />
                  </div>
                  <div className="form-group text-end mt-3">
                    <button type="submit" className={`btn btn-primary ${styles['btn-primary']}`}>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </>
          )
        ) : changePassword ? (
          <>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-control ${styles['form-control']}`}
                  id="username"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="form-group text-end mt-3">
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className={`btn btn-primary ${styles['btn-primary']}`}
                >
                  Send OTP
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles['card-header']}>Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Email</label>
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-control ${styles['form-control']}`}
                    id="username"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Password</label>
                  <div className={styles['input-container']}>
                    <input
                      type={showIcon ? 'text' : 'password'}
                      className={`form-control ${styles['form-control']}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                    <span className={styles['eye-icon']} onClick={handleShowPassword}>
                      {showIcon ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  <p className="mt-3 mb-0 text-muted text-end">
                    <a
                      onClick={() => setChangePassword(true)}
                      style={{ cursor: 'pointer' }}
                      className="ms-1 text-decoration-none text-primary"
                    >
                      Forgot password?
                    </a>
                  </p>
                </div>
                <div className={`${styles['button-div']} text-center mt-4`}>
                  <button type="submit" className={`btn btn-primary btn-block w-100 ${styles['btn-primary']}`}>
                    Login
                  </button>
                  <p className="mt-3 mb-0 text-muted">
                    Don't have an account?
                    <a href="/addUser" className="ms-1 text-decoration-none text-primary">
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </>
        )}

        {showModel && (
          <MessageModel message={message} type={messageType} onClose={() => setShowModel(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
