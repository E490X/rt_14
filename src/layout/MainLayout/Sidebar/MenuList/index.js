// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import { useDevice } from "contexts/DeviceContext";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const filterIosOnly = (item, isIOS) => {
  if (item.iosOnly && !isIOS) return null;
  if (!item.children) return item;
  const children = item.children
    .map((child) => filterIosOnly(child, isIOS))
    .filter(Boolean);
  return { ...item, children };
};

const MenuList = () => {
  let { items } = menuItem();
  const { isIOS } = useDevice();
  items = items.map((item) => filterIosOnly(item, isIOS)).filter(Boolean);
  const navItems = items?.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
