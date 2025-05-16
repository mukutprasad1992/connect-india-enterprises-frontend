import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";
import Image from "next/image";

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
  const sidebarWidth = "270px";

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        width: sidebarWidth,
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 3,
        ...scrollbarStyles,
      }}
    >
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <Image
          src="/images/logos/logo-transparent.svg"
          alt="Logo"
          width={150}
          height={40}
        />
      </Box>
      <SidebarItems toggleMobileSidebar={toggleMobileSidebar} />
      <Box mt="auto">
        <Upgrade />
      </Box>
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
            sx: { boxSizing: "border-box", ...scrollbarStyles },
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
