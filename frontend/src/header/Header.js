import React from "react";
import { AppBar, Tab, Tabs, Toolbar } from "@mui/material";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Diaries", to: "/diaries" },
];

const Header = () => {
  const { pathname } = useLocation();
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
