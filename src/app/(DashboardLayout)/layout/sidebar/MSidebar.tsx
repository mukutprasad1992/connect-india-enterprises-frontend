import { Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Updrade";
import Image from "next/image";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event?: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const MSidebar = ({
  isSidebarOpen,
  isMobileSidebarOpen,
  onSidebarClose,
  toggleMobileSidebar,
}: ItemType) => {
  const desktopSidebarWidth = isSidebarOpen ? 270 : 80;
  const mobileSidebarWidth = 270;

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  const SidebarContent = ({ width }: { width: number }) => (
    <Box sx={{ width, flexShrink: 0, transition: "width 0.3s" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: width === 270 ? "center" : "flex-start",
          px: width === 270 ? 0 : 1,
        }}
      >
        {width === 270 ? (
          <Box sx={{ mt: 3 }}>
            <Image
              src="/images/logos/logo-transparent.svg"
              alt="Full Logo"
              width={230}
              height={55}
              style={{ objectFit: "contain" }}
            />
          </Box>
        ) : (
          <Box sx={{ ml: 1.3, mt: 4, mb: 1 }}>
            <Image
              src="/images/logos/smallLogo.png"
              alt="Logo Icon"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>

      <SidebarItems
        toggleMobileSidebar={toggleMobileSidebar}
        isSidebarOpen={width === 270}
        onSidebarClose={onSidebarClose}
      />

      <Box mt="auto">{width === 270 && <Upgrade />}</Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: desktopSidebarWidth,
          flexShrink: 0,
          display: { xs: "none", lg: "block" },
        }}
      >
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              width: desktopSidebarWidth,
              ...scrollbarStyles,
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <SidebarContent width={desktopSidebarWidth} />
        </Drawer>
      </Box>
      <Drawer
        anchor="left"
        open={isMobileSidebarOpen}
        onClose={() => onSidebarClose()}
        variant="temporary"
        PaperProps={{
          sx: {
            boxShadow: (theme) => theme.shadows[8],
            width: mobileSidebarWidth,
            ...scrollbarStyles,
            display: { xs: "block", lg: "none" },
          },
        }}
      >
        <SidebarContent width={mobileSidebarWidth} />
      </Drawer>
    </>
  );
};

export default MSidebar;
