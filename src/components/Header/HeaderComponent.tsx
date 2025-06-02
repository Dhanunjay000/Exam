import React, { useEffect, useState } from "react";
import styles from "./HeaderComponent.module.css";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { IconButton, Menu, MenuItem, Avatar, Typography, Divider, ListItemIcon } from "@mui/material";
import { Logout, AccountCircle, ExpandMore, Dashboard } from '@mui/icons-material';
import ProfileComponent from "../Profile/ProfileComponent";
import ConfirmationModal from "../Models/ConfirmationModel";

const HeaderComponent: React.FC = () => {

  const [username, setUsername] = useState<string>("");
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const result = Cookies.get("username");
    if (result)
      setUsername(result);
  }, []);

  const onLogout = () => {
    Cookies.remove("username");
    router.push("/login");
    setShowLogoutModal(false);
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <header className={styles.header}>

      <div className="flex items-center">
        <img
          src="https://static.vecteezy.com/system/resources/previews/010/761/238/non_2x/dj-logo-d-j-design-white-dj-letter-dj-letter-logo-design-initial-letter-dj-linked-circle-uppercase-monogram-logo-vector.jpg"
          alt="Company Logo"
          width={60}
          height={60}
          className="rounded-lg"
        />
      </div>

      {showLogoutModal && (
        <ConfirmationModal
          message="Are you sure. You want to exit "
          onConfirm={onLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      {showModel && (
        <ProfileComponent username={username} setShowModel={setShowModel} />
      )}

      <div className="flex items-center space-x-2 ml-auto">
      <span className="text-sm font-semibold ">{username}</span>
        <IconButton onClick={handleMenuOpen}>
          <Avatar className={styles.IconButton} >{username?.charAt(0).toUpperCase()}</Avatar>
          <ExpandMore />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Typography variant="subtitle1" sx={{ px: 2, pt: 1 }}>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ px: 2, pb: 1 }} color="text.secondary">
            Manage your account
          </Typography>
          <Divider />
          <MenuItem onClick={() => { setShowModel(true); handleMenuClose(); }}>
            <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
            View Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { router.push('/dashboard') }}>
            <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
            Dashboard
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setShowLogoutModal(true); handleMenuClose(); }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: 'red' }} /></ListItemIcon>
            <span style={{ color: 'red' }}>Logout</span>
          </MenuItem>
        </Menu>
      </div>


    </header>
  );
};

export default HeaderComponent;
