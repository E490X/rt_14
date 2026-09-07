// assets
import { FaGauge, FaMobileScreen } from "react-icons/fa6";

// constant
const icons = { FaGauge, FaMobileScreen };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/dashboard",
      icon: icons.FaGauge,
      breadcrumbs: false,
    },
    {
      id: "all-devices",
      title: "All Device",
      type: "item",
      url: "/all-device-list",
      icon: icons.FaMobileScreen,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
