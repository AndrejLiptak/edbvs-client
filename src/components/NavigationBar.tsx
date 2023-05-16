import { useAuth0 } from "@auth0/auth0-react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import OfflineBoltOutlinedIcon from "@mui/icons-material/OfflineBoltOutlined";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "../styles/main.css";

export function NavigationBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
    });
  };

  const handleRegister = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: { screen_hint: "signup" },
    });
  };

  const {
    logout,
    user,
    getAccessTokenSilently,
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: import.meta.env.VITE_REACT_APP_AUTH0_LOGOUT_URL,
      },
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  var isAdmin = false;

  if (user) {
    const roles = user["https://myroles.com/roles"];
    if (roles.includes("admin")) isAdmin = true;
  }

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          height: "50px",
          
          position: "fixed",
        }}
      >
        <Toolbar variant="dense">
          <OfflineBoltOutlinedIcon sx={{ mr: 1 }} fontSize="large" />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,

              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Designer
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            {!isAuthenticated && (
              <>
                <Button onClick={handleLogin} color="inherit">
                  Log in
                </Button>
                <Button onClick={handleRegister} color="inherit">
                  Register
                </Button>
              </>
            )}
            {isAuthenticated && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{ mt: "30px" }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem {...{ component: RouterLink, to: "/profile" }}>
                    My devices
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem {...{ component: RouterLink, to: "/admin" }}>
                      Admin page
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleLogout}>LogOut</MenuItem>
                </Menu>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
