'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { Person, VpnKey } from "@mui/icons-material";
import axios from "axios";
import ChangePasswordDialog from "../../components/changePassword/changePassword";
import { jwtDecode } from "jwt-decode";
import CloseConfirmDialog from "../CloseConfirmDialog";
import LogOutConfirmDialog from "../LogOutConfirmDialog";

interface ProfileData {
  firstName: string;
  lastName: string;
  profileImageURL: string;
}

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'User',
    lastName: '',
    profileImageURL: '/images/profile/user-1.jpg',
  });

  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  let profileImageURL: string | undefined;

  if (typeof window !== 'undefined') {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        profileImageURL = user?.profileImageURL;

      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }
  const handleClick = (event: any) => {
    fetchProfile();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    handleClose();
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    setOpenLogoutDialog(false);
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    router.push('/utilities/profile');
  };

  const handleChangePassword = () => {
    handleClose();
    setOpenDialog(true);
  };

  const fetchProfile = async () => {
    if (!token) {
      localStorage.clear();
      router.replace("/authentication/login");
      return;
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const response = await axios.get(`${BASE_URL}/profile/getProfileById`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.result;
      if (data) {
        setProfile({
          firstName: data.firstName || 'User',
          lastName: data.lastName || '',
          profileImageURL: data.profileImageURL || '/images/profile/user-1.jpg',
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      handleLogoutConfirm();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [BASE_URL, token, router]);

  return (
    <>
      <Box>
        <Tooltip title="Profile">
          <IconButton
            size="large"
            color="inherit"
            onClick={handleClick}
            sx={{ color: "black", borderRadius: '4px', m: 0, p: 0 }}
          >
            <Avatar
              src={profile.profileImageURL}
              alt={`${profile.firstName} ${profile.lastName}`}
              sx={{ width: 35, height: 35 }}
            />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          sx={{ "& .MuiMenu-paper": { width: 200 } }}
        >
          <Box display="flex" alignItems="center" px={2} py={1}>
            <Person sx={{ color: 'brown', mr: 1.5 }} />
            <Typography>
              {profile.firstName} {profile.lastName}
            </Typography>
          </Box>

          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon><IconUser fontSize="small" /></ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleChangePassword}>
            <ListItemIcon><VpnKey fontSize="small" /></ListItemIcon>
            <ListItemText>Change Password</ListItemText>
          </MenuItem>

          <Box mt={1} py={1} px={2}>
            <Button variant="outlined" color="primary" fullWidth onClick={handleLogoutClick}>
              Logout
            </Button>
          </Box>
        </Menu>
        <ChangePasswordDialog open={openDialog} onClose={() => setOpenDialog(false)} />
        <LogOutConfirmDialog
          open={openLogoutDialog}
          handleCancelClose={handleLogoutCancel}
          handleConfirmClose={handleLogoutConfirm}
        />
      </Box>
    </>
  );
};

export default Profile;
