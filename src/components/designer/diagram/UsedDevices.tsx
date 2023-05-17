import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import WestIcon from "@mui/icons-material/West";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { IDevice } from "../../../types";
import { DeviceDetail } from "../DeviceDetail";
import { ColorPicker } from "./ColorPicker";
import { CustomNode } from "./nodes/DeviceNode";
import { UsedDeviceItem } from "./UsedDevicesItem";

type Props = {
  deviceList: Map<IDevice, number>;
  deleteDevice: (device: IDevice) => void;
  totalPowerLoss: number;
  setPhaseCount: (phase: number) => void;
  totalDINSlots: number;
  addToList: (device: IDevice) => void;
  nodes: CustomNode[];
  setNodes: (nodes: CustomNode[]) => void;
  setColorCircuit: (color: string) => void;
  setColorRCD: (color: string) => void;
  setColorSurge: (color: string) => void;
  setColorPLC: (color: string) => void;
  setColorGeneric: (color: string) => void;
  colorCircuit: string;
  colorRCD: string;
  colorSurge: string;
  colorPLC: string;
  colorGeneric: string;
};

export function UsedDevices({
  deviceList,
  deleteDevice,
  totalPowerLoss,
  nodes,
  totalDINSlots,
  addToList,
  setNodes,
  setColorCircuit,
  setColorGeneric,
  setColorPLC,
  setColorRCD,
  setColorSurge,
  colorCircuit,
  colorGeneric,
  colorPLC,
  colorRCD,
  colorSurge,
}: Props) {
  
 
  let keys = Array.from(deviceList.keys());
  let circuitBreakers = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "CircuitBreaker"
  );
  let RCDs = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "RCD"
  );
  let surgeProtectors = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "SurgeProtector"
  );
  let PLCs = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "PLC"
  );
  let genericDevices = Array.from(deviceList.keys()).filter(
    (device) => device.__typename === "GenericDevice"
  );

  

  return (
    <Box
      sx={{
        m: 4,
        width: "100%",
        maxWidth: 300,
        maxHeight: "70%",
        minHeight: "200px",
        position: "absolute",
        zIndex: +1,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <Typography variant="h6" sx={{ pt: 2, pb: 1, pl: 2 }} flexGrow={1}>
          Used devices
          <Tooltip title="Drag and drop devices on the canvas">
            <HelpIcon sx={{ pl: 1 }}></HelpIcon>
          </Tooltip>
        </Typography>
        <Typography variant="h6" sx={{ pt: 2, pb: 1, pr: 2 }} flexGrow={0}>
          Count
        </Typography>
      </div>
      <div style={{ height: "100%", overflow: "auto" }}>
        <List
          dense
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
            ></ListSubheader>
          }
        >
          <Divider></Divider>
          {circuitBreakers.length > 0 && (
            <ListSubheader sx={{ display: "flex", alignItems: "center" }}>
              <ColorPicker
                nodes={nodes}
                setNodes={setNodes}
                type="CircuitBreaker"
                setColorDevice={setColorCircuit}
                colorInitial={colorCircuit}
              ></ColorPicker>
              <Typography sx={{ fontSize: "15px" }}>
                Circuit breakers{" "}
              </Typography>
            </ListSubheader>
          )}
          {circuitBreakers.map((device: IDevice, i: any) =>
            <UsedDeviceItem addToList={addToList} deleteDevice={deleteDevice} device={device} deviceList={deviceList} key={`${device.id}${device.__typename}`}></UsedDeviceItem>
          )}

          {RCDs.length > 0 && (
            <ListSubheader sx={{ display: "flex", alignItems: "center" }}>
              <ColorPicker
                nodes={nodes}
                setNodes={setNodes}
                type="RCD"
                setColorDevice={setColorRCD}
                colorInitial={colorRCD}
              ></ColorPicker>
              <Typography sx={{ fontSize: "15px" }}>RCDs </Typography>
            </ListSubheader>
          )}
          {RCDs.map((device: IDevice, i: any) => <UsedDeviceItem addToList={addToList} deleteDevice={deleteDevice} device={device} deviceList={deviceList}  key={`${device.id}${device.__typename}`} ></UsedDeviceItem>)}

          {surgeProtectors.length > 0 && (
            <ListSubheader sx={{ display: "flex", alignItems: "center" }}>
              <ColorPicker
                nodes={nodes}
                setNodes={setNodes}
                type="SurgeProtector"
                setColorDevice={setColorSurge}
                colorInitial={colorSurge}
              ></ColorPicker>
              <Typography sx={{ fontSize: "15px" }}>
                Surge protectors
              </Typography>
            </ListSubheader>
          )}
          {surgeProtectors.map((device: IDevice, i: any) =>
            <UsedDeviceItem addToList={addToList} deleteDevice={deleteDevice} device={device} deviceList={deviceList}  key={`${device.id}${device.__typename}`}></UsedDeviceItem>
          )}

          {PLCs.length > 0 && (
            <ListSubheader sx={{ display: "flex", alignItems: "center" }}>
              <ColorPicker
                nodes={nodes}
                setNodes={setNodes}
                type="PLC"
                setColorDevice={setColorPLC}
                colorInitial={colorPLC}
              ></ColorPicker>
              <Typography sx={{ fontSize: "15px" }}>PLCs</Typography>
            </ListSubheader>
          )}
          {PLCs.map((device: IDevice, i: any) => <UsedDeviceItem addToList={addToList} deleteDevice={deleteDevice} device={device} deviceList={deviceList} key={`${device.id}${device.__typename}`}></UsedDeviceItem>)}

          {genericDevices.length > 0 && (
            <ListSubheader sx={{ display: "flex", alignItems: "center" }}>
              <ColorPicker
                nodes={nodes}
                setNodes={setNodes}
                type="GenericDevice"
                setColorDevice={setColorGeneric}
                colorInitial={colorGeneric}
              ></ColorPicker>
              <Typography sx={{ fontSize: "15px" }}>Generic devices</Typography>
            </ListSubheader>
          )}
          {genericDevices.map((device: IDevice, i: any) =>
            <UsedDeviceItem addToList={addToList} deleteDevice={deleteDevice} device={device} deviceList={deviceList} key={`${device.id}${device.__typename}`}></UsedDeviceItem>
          )}

          {keys.length == 0 && (
            <>
              <ListItem>
                <ListItemIcon>
                  <WestIcon fontSize="large" color="primary" />
                </ListItemIcon>

                <Typography align="center">
                  Start by adding devices from the list.
                </Typography>
              </ListItem>
              <Divider></Divider>
            </>
          )}

          <ListItem key={"DINSlots"}></ListItem>
        </List>
      </div>
      <List>
        <ListItem key={"powerLoss"} sx={{ height: "40px" }}>
          <ListItemText
            primary={`Total power loss: `}
            secondary={`${totalPowerLoss / 100} W`}
          />
        </ListItem>
        <ListItem key={"din"} sx={{ height: "40px" }}>
          <ListItemText primary={`DIN slots: `} secondary={totalDINSlots} />
        </ListItem>
      </List>
    </Box>
  );
}
