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
  Typography
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { Person, VpnKey } from "@mui/icons-material";
import axios from "axios";
import ChangePasswordDialog from "../../../authentication/changePassword/page";

interface ProfileData {
  firstName: string;
  lastName: string;
  profileImageURL: string;
}

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    profileImageURL: '/images/profile/user-1.jpg',
  });

  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const handleClick = (event: any) => {
    fetchProfile();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    router.push("/authentication/login");
  };

  const handleProfileClick = () => {
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

    try {
      const response = await axios.get(`${BASE_URL}/profile/getProfileById`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.result;
      if (data) {
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          profileImageURL: data.profileImageURL || '/images/profile/user-1.jpg',
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [BASE_URL, token, router]);

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
        sx={{ ...(anchorEl && { color: 'primary.main' }) }}
      >
        <Avatar
          src={profile.profileImageURL}
          alt={`${profile.firstName} ${profile.lastName}`}
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

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
          <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>

      {/* 🔐 Password change dialog */}
      <ChangePasswordDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default Profile;
