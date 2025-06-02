import React, { useEffect, useState } from "react";
import getMenuItems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Tooltip } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

interface SidebarItemsProps {
  toggleMobileSidebar: () => void;
  isSidebarOpen: boolean;
  onSidebarClose?: () => void;
}

const SidebarItems = ({
  toggleMobileSidebar,
  isSidebarOpen,
  onSidebarClose,
}: SidebarItemsProps) => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("roleId");
      const roleId = storedRole ? parseInt(storedRole, 10) : null;

      if (roleId) {
        const items = getMenuItems(roleId);
        setMenuItems(items);
      }
    }
  }, []);

  const handleNavItemClick = (item: any) => {
    // Only close the sidebar if it's not a dialog trigger
    if (!item.isDialog && window.innerWidth < 1200) {
      onSidebarClose?.();
    }
  };

  return (
    <Box sx={{ p: 2.3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {menuItems.map((item) => {
          const content = item.navlabel ? (
            <NavGroup
              item={item}
              key={item.subheader}
              isSidebarOpen={isSidebarOpen}
            />
          ) : (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathname}
              isSidebarOpen={isSidebarOpen}
              onClick={() => handleNavItemClick(item)}
            />
          );

          return item.navlabel || isSidebarOpen ? (
            content
          ) : (
            <Tooltip key={item.id} title={item.title} placement="right">
              <Box>{content}</Box>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
