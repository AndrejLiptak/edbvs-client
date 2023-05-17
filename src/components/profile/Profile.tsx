import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FormEvent, ReactNode, useState } from "react";
import {
  User,
  usePostCompanyRequestMutation,
  usePostUserMutation,
  useUpdateRequestMutation,
  useUserQuery,
} from "../../graphql/generated";
import "../../styles/main.css";
import { NavigationBar } from "../NavigationBar";
import { CompanyRequestForm } from "./CompanyRequestForm";
import { ProfileCircuitBreakers } from "./devices/ProfileCircuitBreaker";
import { ProfileEnclosures } from "./devices/ProfileEnclosures";
import { ProfileGenericDevices } from "./devices/ProfileGenericDevices";
import { ProfilePLCs } from "./devices/ProfilePLCs";
import { ProfileRCD } from "./devices/ProfileRCD";
import { ProfileSurgeProtectors } from "./devices/ProfileSurgeProtectors";

interface TabPanelProps {
  children?: ReactNode;
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
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 0, height: "100%" }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ProfilePage() {
  const onSubmit = (
    event: FormEvent<HTMLFormElement>,
    { companyName, companyICO }: { companyName: string; companyICO: string }
  ) => {
    event.preventDefault();
    setOpen(false);
    setApprovalButton(false);

    const variables = {
      userEmail: userData?.email!,
      companyName: companyName,
      companyICO: Number(companyICO),
    };
    if (userData?.approval) {
      updateRequest(variables);
    } else {
      postRequest(variables);
    }
  };

  const [tab, setTab] = useState(0);
  const [newUser, setNewUser] = useState<User | undefined>();
  const [mutationExecuted, setMutationExecuted] = useState(false);
  const [approvalButton, setApprovalButton] = useState(true);
  const [open, setOpen] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const email = user?.email;
  const name = user?.name;

  const variables = {
    email: email!,
  };
  const userQuery = useUserQuery({ variables });
  const [postUserResult, postUser] = usePostUserMutation();
  const [postRequestResult, postRequest] = usePostCompanyRequestMutation();
  const [updateRequestResult, updateRequest] = useUpdateRequestMutation();
  const [requestModify, setRequestModify] = useState({
    companyName: "",
    companyICO: "",
  });
  const userInDb = userQuery[0];

  // if (!newUser && (!userInDb || userInDb.fetching))
  // return <CircularProgress className="CircularProgress" />;

  if (
    !newUser &&
    userInDb.data &&
    userInDb.data.User == null &&
    !mutationExecuted
  ) {
    setMutationExecuted(true);
    const variables = { email: email!, name: name! };
    postUser(variables).then((result) => {
      if (result.data && result.data.postUser) setNewUser(result.data.postUser);
    });

    if (postUserResult.fetching)
      return <CircularProgress className="CircularProgress" />;
  }

  // if (!newUser && (!userInDb.data || !userInDb.data.User))
  //  return <CircularProgress className="CircularProgress" />;

  // if (!newUser && !userInDb.data)
  //  return <CircularProgress className="CircularProgress" />;
  var userData = userInDb.data?.User;
  if (newUser) userData = newUser;

  var isAdmin = false;
  if (user) {
    const roles = user["https://myroles.com/roles"];
    if (roles.includes("admin")) isAdmin = true;
  }

  return (
    <div style={{ height: "100%" }}>
      <NavigationBar />
      <div className="Profile">
        <Typography sx={{ mt: 4, mb: 2 }} variant="h4">
          User: {userData?.name!}{" "}
          {userData?.name === undefined && <CircularProgress />}
        </Typography>
        {userData?.isCompany! && (
          <>
            <Typography variant="h6">
              Company name: {userData.companyName}
            </Typography>{" "}
            <Typography variant="h6">ICO: {userData.companyICO}</Typography>
          </>
        )}
        {approvalButton &&
          userData &&
          !userData?.isCompany! &&
          (!userData?.approval ||
            userData?.approval.approved ||
            (userData?.approval && userData.approval.rejected)) && (
            <Button onClick={() => setOpen(true)}>
              {!userData?.approval && <>Upgrade to company account</>}
              {userData?.approval && <>Resubmit company upgrade form</>}
            </Button>
          )}
        <Modal open={open} onClose={() => setOpen(false)}>
          <>
            <CompanyRequestForm
              handleOpen={setOpen}
              onSubmit={onSubmit}
            ></CompanyRequestForm>
          </>
        </Modal>
        <Typography variant="h5" paddingTop={3}>
          My devices
        </Typography>
        <Box sx={{ width: "100%", height: "55%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Circuit breakers" {...a11yProps(0)} />
              <Tab label="RCDs" {...a11yProps(1)} />
              <Tab label="Surge protectors" {...a11yProps(2)} />
              <Tab label="PLCs" {...a11yProps(3)} />
              <Tab label="Generic devices" {...a11yProps(4)} />
              <Tab label="Enclosures" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <ProfileCircuitBreakers
              circuitBreakers={userData?.circuitBreakers!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ProfileRCD
              RCDs={userData?.RCDs!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <ProfileSurgeProtectors
              surgeProtectors={userData?.surgeProtectors!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <ProfilePLCs
              PLCs={userData?.PLCs!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <ProfileGenericDevices
              genericDevices={userData?.genericDevices!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
          <TabPanel value={tab} index={5}>
            <ProfileEnclosures
              enclosures={userData?.enclosures!}
              userEmail={userData?.email!}
              isAdmin={isAdmin}
            />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}
