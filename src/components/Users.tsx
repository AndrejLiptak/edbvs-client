import { useAuth0 } from "@auth0/auth0-react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {
  useCircuitBreakerQuery,
  useEnclosuresQuery,
  useGenericDevicesQuery,
  usePlCsQuery,
  useRcDsQuery,
  useRequestsQuery,
  useSurgeProtectorsQuery,
  useUsersQuery,
  useVerifyCircuitMutation,
  useVerifyEnclosureMutation,
  useVerifyGenericMutation,
  useVerifyPlcMutation,
  useVerifyRcdMutation,
  useVerifySurgeMutation,
} from "../graphql/generated";
import { RequestGrid } from "./CompanyRequests";
import { NavigationBar } from "./NavigationBar";
import { UsersGrid } from "./UsersGrid";
import { AdminDevice } from "./adminDevices";
import { useState } from "react";
import { Navigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && <Box sx={{ p: 3, height: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function Users() {
  function executeQuerry() {
    const [userInDb] = useUsersQuery();
    return userInDb;
  }

  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [requestsDB] = useRequestsQuery();
  const { user } = useAuth0();
  var isAdmin = false;

  if (user) {
    const roles = user["https://myroles.com/roles"];
    if (roles.includes("admin")) isAdmin = true;
  }

  const usersInDb = executeQuerry();

  const circuitBreakers = useCircuitBreakerQuery();
  const [postCircuitVerifyResult, postCircuitVerify] =
    useVerifyCircuitMutation();

  const rcds = useRcDsQuery();
  const [postRcdVerifyResult, postRcdVerify] = useVerifyRcdMutation();

  const plcs = usePlCsQuery();
  const [postPlcVerifyResult, postPlcVerify] = useVerifyPlcMutation();

  const surgeProtectors = useSurgeProtectorsQuery();
  const [postSurgeVerifyResult, postSurgeVerify] = useVerifySurgeMutation();

  const enclosures = useEnclosuresQuery();
  const [postEcnlosureVerifyResult, postEnclosureVerify] =
    useVerifyEnclosureMutation();

  const genericDevices = useGenericDevicesQuery();
  const [postVerifyGenericResult, postVerifyGeneric] =
    useVerifyGenericMutation();
  if (!isAdmin) return 	<Navigate to="/profile" />
  const users = usersInDb.data?.Users;
  const requests = requestsDB.data?.CompanyRequests;

  return (
    <>
      <NavigationBar />
      <div className="Profile">
        <Box sx={{ width: "100%", height: "90%", pt: 3}}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Users" {...a11yProps(0)} />
              <Tab label="Company requests" {...a11yProps(1)} />
              <Tab label="Circuit breakers" {...a11yProps(2)} />
              <Tab label="RCDs" {...a11yProps(3)} />
              <Tab label="Surge protectors" {...a11yProps(4)} />
              <Tab label="PLCs" {...a11yProps(5)} />
              <Tab label="Generic devices" {...a11yProps(6)} />
              <Tab label="Enclosures" {...a11yProps(7)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <UsersGrid users={users!}></UsersGrid>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <RequestGrid
              requests={requests?.filter(
                (request) =>
                  request.approved == false && request.rejected == false
              )!}
            ></RequestGrid>
          </TabPanel>
          <TabPanel value={tab} index={2}>
          <AdminDevice
            devices={circuitBreakers[0].data?.CircuitBreakers!}
            postDevice={postCircuitVerify}
            type="CircuitBreaker"
          />
          </TabPanel>
          <TabPanel value={tab} index={3}>
          <AdminDevice
            devices={rcds[0].data?.RCDs!}
            postDevice={postRcdVerify}
            type="RCD"
          />
          </TabPanel>
          <TabPanel value={tab} index={4}>
          <AdminDevice
            devices={surgeProtectors[0].data?.SurgeProtectors!}
            postDevice={postSurgeVerify}
            type="SurgeProtector"
          />
          </TabPanel>
          <TabPanel value={tab} index={5}>
          <AdminDevice
            devices={plcs[0].data?.PLCs! ?? []}
            postDevice={postPlcVerify}
            type="PLC"
          />
          </TabPanel>
          <TabPanel value={tab} index={6}>
          <AdminDevice
            devices={genericDevices[0].data?.GenericDevices!}
            postDevice={postVerifyGeneric}
            type="GenericDevice"
          />
          </TabPanel>
          <TabPanel value={tab} index={7}>
          <AdminDevice
            devices={enclosures[0].data?.Enclosures!}
            postDevice={postEnclosureVerify}
            type="Enclosure"
          />
          </TabPanel>
        </Box>

        
      </div>
    </>
  );
}
