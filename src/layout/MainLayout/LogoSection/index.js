import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { ButtonBase } from "@mui/material";
import config from "config";
const LogoSection = () => (
  <ButtonBase disableRipple component={Link} to={config.defaultPath}>
    <Typography
      // color={theme.palette.secondary.main}
      // gutterBottom
      variant="h2"
      color="#1e88e5"
      ml={3}
    >
      RAT WEB
    </Typography>
  </ButtonBase>
);

export default LogoSection;
