import {
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
  } from "@mui/material";
  import { CircuitBreaker, Plc, Rcd, User } from "../graphql/generated";
  import { useState } from "react";
  import { ExpandLess, ExpandMore } from "@mui/icons-material";
  import { SidebarItem} from "./SidebarItem";
  import { IDevice, UserWithoutDevices } from "../types";
  import { SidebarPole } from "./SidebarCircuitPole";
  
  type Props = {
    PLCs: Plc[];

    addToList: (device: IDevice) => void;
  };
  
  export function SidebarPLC({ PLCs, addToList }: Props) {
    const [open, setOpen] = useState(false);

  

  
    return (
      <div key={"PLCs"}>
        <ListItemButton
          onClick={() => {
            setOpen(!open);
          }}
          disableGutters
          divider
        >
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary="PLCs" />
        </ListItemButton>
        <Collapse in={open}>
        {PLCs.map((plc: Plc) => (
          <SidebarItem
            addToList={addToList}
            device={plc}
            key={`${plc.id}PLC`}
            text={`${plc.name}(${plc.id})` }
          />
        ))}
        </Collapse>
      </div>
    );
  }
  