import React, { useEffect, useState } from "react";
import styles from "./ProfileComponent.module.css";
import Cookies from "js-cookie";
import SpinnerComponent from "../common/spinner/SpinnerComponent";
import MessageModel from "../Models/MessageModel";
interface UserProfile {

  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  username: string;
  gender: string;

}
interface ProfileComponentProps {
  username: string;
  setShowModel: (arg: boolean) => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ username, setShowModel }) => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [originalUserDetails, setOriginalUserDetails] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailsUpdated, setDetailsUpdated] = useState<boolean>(false);
  const [showMsgModel, setShowMsgModel] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`api/users?username=${username}`);
        const data = await response.json();
        setUserDetails(data?.user);
        setOriginalUserDetails(data?.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (JSON.stringify(userDetails) === JSON.stringify(originalUserDetails)) {
      console.log("No changes detected. Profile update skipped.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        setMessage("Profile details updated successfully!");
        setMessageType('success')
        setShowMsgModel(true);
        // setShowModel(false);
      } else {
        setMessage("Failed to update profile");
        setMessageType('error')
        setShowMsgModel(true);

      }
    } catch (error) {
      ``
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
      setMessageType('error')
      setShowMsgModel(true);
    } finally {
      setLoading(false);
    }
  };


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userDetails)
      return;
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setDetailsUpdated(true)
  }

  return (
    <>
      {loading && <SpinnerComponent />}
      {showMsgModel && <MessageModel message={message} type={messageType} onClose={() => { setShowMsgModel(false); setMessage("") }} />}
      {userDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>User Profile</h2>
              <button className={styles.closeButton} onClick={() => setShowModel(false)}>
                ×
              </button>
            </div>
            <form className={styles.profileContainer} onSubmit={handleUpdateProfile}>
              <div className={styles.profileCard}>
                <div className={styles.profileRow}>
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={userDetails.first_name}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.profileRow}>
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={userDetails.last_name}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.profileRow}>
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={userDetails.dob}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.profileRow}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={userDetails.gender}
                    onChange={(e) => handleChange(e as any)}
                    className={styles.inputField}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className={styles.profileRow}>
                  <label htmlFor="phone">Phone</label>
                  <input type="text" id="phone" value={userDetails.phone} disabled className={styles.inputField} />
                </div>

                <div className={styles.profileRow}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={userDetails.username} disabled className={styles.inputField} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowModel(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.updateButton} disabled={!detailsUpdated}>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileComponent;
