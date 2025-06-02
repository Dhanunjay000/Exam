import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileComponent.module.css";
import SpinnerComponent from "../common/spinner/SpinnerComponent";
import MessageModel from "../Models/MessageModel";
import CountdownTimer from "../Exam/CountdownTimer";

interface UserProfile {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  username: string;
  gender: string;
}

interface ChangePasswordComponentProps {
  username: string;
}

const ChangePasswordComponent: React.FC<ChangePasswordComponentProps> = ({ username }) => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [canResend, setCanResend] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const input_ref = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      input_ref.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
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
    const pastedData = e.clipboardData.getData("Text").trim();
    const otpArray = pastedData.split('').slice(0, otp.length);
    const updatedOtp = [...otp];
    otpArray.forEach((char, i) => {
      if (!isNaN(Number(char))) {
        updatedOtp[i] = char;
      }
    });
    setOtp(updatedOtp);
    const nextIndex = otpArray.length >= otp.length ? otp.length - 1 : otpArray.length;
    input_ref.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New password and confirm password do not match");
      setMessageType("error");
      setShowModel(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const result = await response.json();
      if (response.status !== 200) {
        setMessage(result.error);
        setMessageType("error");
      } else {
        setMessage(result.message);
        setMessageType("success");
        setShowOtp(true);
      }
    } catch (error) {
      setMessage("Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
      setShowModel(true);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length !== 6) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          otp: otp.join('')
        }),
      });

      const result = await response.json();
      if (response.status !== 200) {
        setMessage(result.error);
        setMessageType("error");
      } else {
        setMessage(result.message);
        setMessageType("success");
        // Reset form and OTP state
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setOtp(Array(6).fill(''));
        setShowOtp(false);
      }
    } catch (error) {
      setMessage("Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
      setShowModel(true);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        setMessage(result.message);
        setMessageType("success");
        setCanResend(false);
      } else {
        setMessage(result.error);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
      setShowModel(true);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`api/users?username=${username}`);
        const data = await response.json();
        setUserDetails(data?.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      finally{
        setLoading(false);
      }
    };
    setLoading(true);
    fetchUserDetails();
  }, []);

  return (
    <>
      {loading && <SpinnerComponent />}
    <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {!showOtp ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.profileRow}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </div>

          <div className={styles.profileRow}>
                <label htmlFor="newPassword">New Password</label>
            <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.profileRow}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

              <button type="submit" className={styles.updateButton}>
                Change Password
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} style={{ textAlign: 'center' }}>
              <div className={styles.profileRow}>
                <label>Enter OTP</label>
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
                      ref={(el) => { input_ref.current[index] = el; }}
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '24px',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.updateButton}>
                Verify OTP
              </button>

              <p className="text-end mt-3">
                <a
                  onClick={handleResendOtp}
                  className={`ms-1 text-decoration-none ${canResend ? 'text-primary' : 'text-secondary'}`}
                  style={{ cursor: canResend ? 'pointer' : 'not-allowed' }}
                >
                  Resend OTP {!canResend && <CountdownTimer duration={100} onComplete={() => setCanResend(true)} />}
                </a>
              </p>
            </form>
          )}
        </div>
    </div>
      {showModel && (
        <MessageModel
          message={message}
          type={messageType}
          onClose={() => {
            setShowModel(false);
            setMessage("");
          }}
        />
     )}
    </>
  );
};

export default ChangePasswordComponent;
