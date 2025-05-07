import React, { useEffect, useState } from "react";
import getMenuItems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar: () => void }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

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


  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {menuItems.map((item) =>
          item.navlabel ? (
            <NavGroup item={item} key={item.subheader} />
          ) : (
            <NavItem item={item} key={item.id} pathDirect={pathDirect} onClick={toggleMobileSidebar} />
          )
        )}
      </List>
    </Box>
  );
};

export default SidebarItems;
