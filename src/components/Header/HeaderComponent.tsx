import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import styles from "./HeaderComponent.module.css";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import ProfileComponent from "../Profile/ProfileComponent";
import ConfirmationModal from "../Models/ConfirmationModel";

const HeaderComponent: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showLogoutModal , setShowLogoutModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const result = Cookies.get("username");
    if (result)
      setUsername(result);
  }, [])
  const onLogout = () => {
    Cookies.remove("username");
    router.push("/login");
    setShowLogoutModal(false);
  }
  const onProfile = () => {
    setShowModel(true);
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="https://static.vecteezy.com/system/resources/previews/010/761/238/non_2x/dj-logo-d-j-design-white-dj-letter-dj-letter-logo-design-initial-letter-dj-linked-circle-uppercase-monogram-logo-vector.jpg" width={200} height={200} alt="Logo" />
      </div>

      { showLogoutModal && (
         <ConfirmationModal
         message="Are you sure. You want to exit "
         onConfirm={onLogout}
         onCancel={() => setShowLogoutModal(false)}
       />
      )}
      {showModel && (
            <ProfileComponent username={username} setShowModel={setShowModel} />
      )}

      <div className={styles.profileWrapper}>
        <div
          className={styles.profileInfo}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <span className={styles.username}>{username}</span>
          <FaUserCircle size={24} className={styles.icon} />
        </div>

        {dropdownOpen && (
          <div className={styles.dropdown}>
            <button onClick={onProfile} className={styles.dropdownItem} >
              Profile
            </button>
            <button onClick={()=> setShowLogoutModal(true)} className={styles.dropdownItem}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;
