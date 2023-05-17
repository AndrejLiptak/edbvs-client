import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import { IDevice, UserWithoutDevices } from "../../../types";
import AddIcon from "@mui/icons-material/Add";
import VerifiedIcon from "@mui/icons-material/Verified";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  CircuitBreaker,
  GenericDevice,
  Plc,
  Rcd,
  SurgeProtector,
} from "../../../graphql/generated";
import { SidebarCircuit } from "./SidebarCircuit";
import { SidebarRCD } from "./SidebarRCD";
import { SidebarSurge } from "./SidebarSurge";
import { SidebarPLC } from "./SidebarPLC";
import { SidebarGeneric } from "./SidebarGeneric";
import { DeviceDetail } from "../DeviceDetail";
import { useState } from "react";

type Props = {
  addToList: (device: IDevice) => void;

  all: IDevice[];
  circuitBreakers: CircuitBreaker[];
  RCDs: Rcd[];
  surgeProtectors: SurgeProtector[];
  PLCs: Plc[];
  genericDevices: GenericDevice[];
};

export function SidebarUnified({
  addToList,
  all,
  circuitBreakers,
  RCDs,
  surgeProtectors,
  PLCs,
  genericDevices,
}: Props) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<IDevice | undefined>();

  return (
    <Box
      sx={{
        width: "15%",
        minWidth: "250px",
        background: "background.paper",
        overflow: "auto",
        boxShadow: 24,
        paddingTop: "50px",
        minHeight: "400px",

        flexDirection: "column",
      }}
    >
      <List
        aria-labelledby="nested-list-subheader"
        dense
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Typography variant="h4" sx={{ pt: 2, pb: 1 }}>
              Devices
            </Typography>
          </ListSubheader>
        }
      >
        <Autocomplete
          key={"searchbar"}
          disablePortal
          id="search"
          options={all}
          renderOption={(props, option, { selected }) => {
            return (
              <>
                <ListItem
                  key={option.__typename + option.id}
                  secondaryAction={
                    <IconButton
                      sx={{ mr: -3, ml: -3 }}
                      onClick={() => addToList(option)}
                    >
                      <AddCircleOutlineIcon color="success" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ mr: -6, ml: -1, width: "10px" }}>
                    {option.isVerified && <VerifiedIcon color="secondary" />}
                  </ListItemIcon>
                  <ListItemButton
                    onClick={() => {
                      setOpen(true);
                      setDevice(option);
                    }}
                  >
                    <ListItemText
                      style={{ wordWrap: "break-word" }}
                      primary={` ${option.name} (${option.id})`}
                    ></ListItemText>
                  </ListItemButton>
                </ListItem>
              </>
            );
          }}
          renderInput={(params) => (
            <div
              style={{
                paddingBottom: "1rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              {" "}
              <TextField {...params} label="Search device" />
            </div>
          )}
          getOptionLabel={(option) => option.name + option.id}
          renderTags={() => null}
          multiple={true}
          clearIcon={<></>}
          disableCloseOnSelect={true}
        />
        <SidebarCircuit
          addToList={addToList}
          circuitBreakers={circuitBreakers}
        ></SidebarCircuit>
        <SidebarRCD RCDs={RCDs} addToList={addToList}></SidebarRCD>
        <SidebarSurge
          addToList={addToList}
          surgeProtectors={surgeProtectors}
        ></SidebarSurge>
        <SidebarPLC addToList={addToList} PLCs={PLCs}></SidebarPLC>
        <SidebarGeneric
          addToList={addToList}
          genericDevices={genericDevices}
        ></SidebarGeneric>
        {open && (
          <DeviceDetail
            addToList={addToList}
            device={device!}
            openIn={open}
            handleClose={setOpen}
          />
        )}
      </List>
    </Box>
  );
}
