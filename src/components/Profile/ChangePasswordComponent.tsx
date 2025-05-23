import React, { useEffect, useState } from "react";
import styles from "./ProfileComponent.module.css";
import Cookies from "js-cookie";
import SpinnerComponent from "../common/spinner/SpinnerComponent";
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
    {loading && <SpinnerComponent/>}
    {userDetails && (
    <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileRow}>
            <label htmlFor="password">New Password</label>
            <input
              type="text"
              id="password"
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.profileRow}>
            <label htmlFor="new_password">Confirm Password</label>
            <input
              type="text"
              id="new_password"
              required
              className={styles.inputField}
            />
          </div>
        </div>
    </div>
     )}
    </>
    )
  }

export default ChangePasswordComponent;
