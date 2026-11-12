import React from "react";
import { AppBar, Tab, Tabs, Toolbar } from "@mui/material";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const guestLinks = [
  { label: "Home", to: "/" },
  { label: "Diaries", to: "/diaries" },
  { label: "Login", to: "/auth" },
];
const userLinks = [
  { label: "Home", to: "/" },
  { label: "Diaries", to: "/diaries" },
];

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { pathname } = useLocation();
  const links = isLoggedIn ? userLinks : guestLinks;
  const active = links.some((l) => l.to === pathname) ? pathname : false;

  return (
    <AppBar
      position="sticky"
      sx={{ background: "linear-gradient(90deg, #2b5876, #4e4376)" }}
    >
      <Toolbar>
        <ModeOfTravelIcon />
        <Tabs
          value={active}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#fff" } }}
          sx={{ ml: "auto" }}
        >
          {links.map((link) => (
            <Tab
              key={link.to}
              component={Link}
              to={link.to}
              value={link.to}
              label={link.label}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
