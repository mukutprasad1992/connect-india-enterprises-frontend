import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import BlindsIcon from '@mui/icons-material/Blinds';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import PersonIcon from '@mui/icons-material/Person';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DiscountIcon from '@mui/icons-material/Discount';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const MenuItems = (roleId: number) => {
  const commonMenu = [
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: "/",
    },
  ];

  const manageMenu = [
    {
      navlabel: true,
      subheader: "Manage",
    },
    {
      id: uniqueId(),
      title: "Vendor",
      icon: Diversity3RoundedIcon,
      href: "/utilities/collaborator",
    },
    {
      id: uniqueId(),
      title: "Customer",
      icon: PersonIcon,
      href: "/utilities/customer",
    },
    // {
    //   id: uniqueId(),
    //   title: "Refferal",
    //   icon: DriveFileMoveIcon,
    //   href: "",
    // },
    {
      id: uniqueId(),
      title: "Inquiry",
      icon: HeadsetMicIcon,
      href: "/utilities/inquiry",
    },
    {
      id: uniqueId(),
      title: "Voucher",
      icon: DiscountIcon,
      href: "/utilities/coupon",
    },
  ];

  const vendorMenu = [
    {
      navlabel: true,
      subheader: "Vendor",
    },
    {
      id: uniqueId(),
      title: "Customer",
      icon: PersonIcon,
      href: "/utilities/customer",
    },
    {
      id: uniqueId(),
      title: "Voucher",
      icon: DiscountIcon,
      href: "/utilities/coupon",
    },
  ];

  const normalCustomerMenu = [
    {
      navlabel: true,
      subheader: "Utilities",
    },
    {
      id: uniqueId(),
      title: "Investment",
      icon: InsertChartIcon,
      href: "/utilities/investment",
    },
    {
      id: uniqueId(),
      title: "Policy",
      icon: AssignmentIcon,
      href: "/utilities/policy",
    },
    {
      id: uniqueId(),
      title: "Insurance",
      icon: Diversity1Icon,
      href: "/utilities/insurance",
    },
    {
      id: uniqueId(),
      title: "Loan",
      icon: AccountBalanceWalletIcon,
      href: "/utilities/loan",
    },
  ];

  if (roleId === 1) {
    return [...commonMenu, ...manageMenu];
  } else if (roleId === 2) {
    return [...vendorMenu];
  } else if (roleId === 3) {
    return [...commonMenu, ...normalCustomerMenu];
  }

  return commonMenu;
};


export default MenuItems;
