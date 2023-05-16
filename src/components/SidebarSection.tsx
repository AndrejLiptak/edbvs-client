import { useState } from "react";
import { IDevice, UserWithoutDevices } from "../types";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { SidebarItem } from "./SidebarItem";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { SidebarCircuit } from "./SidebarCircuit";

type Props = {
  deviceGroup: [IDevice[], string];
  addToList: (device: IDevice) => void;
  users: UserWithoutDevices[];
};

export function SidebarSection({ deviceGroup, addToList, users }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div key={deviceGroup[1]}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        sx={{ bgcolor: "#f5f5f5" }}
      >
        <ListItemText primary={deviceGroup[1]} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open}>
        <List>

          {deviceGroup[0].map((circuitBreaker) => (
            <>
            
              <SidebarItem
                addToList={addToList}
                device={circuitBreaker}
                users={users}
                text="heeh"
              />
            </>
          ))}
        </List>
      </Collapse>
    </div>
  );
}
