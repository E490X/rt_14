import dashboard from "./dashboard";
import utilities from "./utilities";
import { useLocation } from "react-router-dom";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
  const location = useLocation();
  if (location.pathname === "/dashboard" || location.pathname==='/all-device-list') {
    return {
      items: [dashboard],
    };
  }

  return {
    items: [utilities],
  };
};

export default menuItems;
