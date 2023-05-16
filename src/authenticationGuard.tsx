import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import React from "react";
import "./styles/main.css"


export const AuthenticationGuard = ({
  component,
}: {
  component: React.ComponentType;
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <CircularProgress className="CircularProgress"/>
      </div>
    ),
  });

  return <Component />;
};
