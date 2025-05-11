import { useMediaQuery, Box, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  toggleMobileSidebar,
}: ItemType) => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const sidebarWidth = 270;

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  const CustomLogo = () => (
    <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
      <img src="/images/logos/logo-transparent.svg" alt="Logo" width="150" />
    </Box>
  );

  const SidebarContent = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CustomLogo />
      <Box sx={{ flex: 1, overflowY: "auto", ...scrollbarStyles }}>
        <SidebarItems toggleMobileSidebar={toggleMobileSidebar} />
      </Box>
      <Divider />
      <Upgrade />
    </Box>
  );

  if (lgUp) {
    return (
      <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: "border-box",
              ...scrollbarStyles,
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  );
};

export default MSidebar;
