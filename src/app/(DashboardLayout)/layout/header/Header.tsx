"use client";

import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuOpenSharpIcon from '@mui/icons-material/MenuOpenSharp';
import Profile from "./Profile";
import Notification from "../../utilities/notification/page";

interface HeaderProps {
  toggleMobileSidebar: () => void;
  toggleSidebar: () => void;
}

const Header = ({ toggleMobileSidebar, toggleSidebar }: HeaderProps) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled
      position="sticky"
      color="default"
      sx={{ borderBottom: 1, borderColor: "#f0f0f0" }}
    >
      <ToolbarStyled>
        <Tooltip title="Toggle Menu">
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (window.innerWidth >= 1200) {
                toggleSidebar();
              } else {
                toggleMobileSidebar();
              }
            }}
            sx={{
              display: "inline",
            }}
          >
            <MenuOpenSharpIcon width="20" height="20" />
          </IconButton>
        </Tooltip>

        <Box flexGrow={40} />
        <Notification />
        <Box />
        <Stack direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
