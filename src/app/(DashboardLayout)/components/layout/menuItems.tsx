// components/constants/menuItems.ts
import { Dashboard, Lock, Business, People, HelpOutline, CardGiftcard, Policy, Lan } from "@mui/icons-material";
import { ReactNode } from "react";


export type MenuItemType = {
    label: string;
    icon: ReactNode;
    route: string;
};

export type RoleBasedMenu = {
    [role: number]: MenuItemType[];
};

export const menuItems: RoleBasedMenu = {
    1: [
        { label: "Dashboard", icon: <Dashboard />, route: "/" },
        { label: "Vendor", icon: <Business />, route: "/utilities/collaborator" },
        { label: "Customer", icon: <People />, route: "/utilities/customer" },
        { label: "Inquiry", icon: <HelpOutline />, route: "/utilities/inquiry" },
        { label: "Voucher", icon: <CardGiftcard />, route: "/utilities/coupon" },
    ],
    2: [
        { label: "Customer", icon: <People />, route: "/utilities/customer" },
        { label: "Voucher", icon: <CardGiftcard />, route: "/utilities/coupon" },
    ],
    3: [
        { label: "Dashboard", icon: <Dashboard />, route: "/" },
        { label: "Investment", icon: <Business />, route: "/utilities/investment" },
        { label: "Policy", icon: <Policy />, route: "/utilities/policy" },
        { label: "Insurance", icon: <Lock />, route: "/utilities/insurance" },
        { label: "Loan", icon: <Lan />, route: "/utilities/loan" },
    ],
};
