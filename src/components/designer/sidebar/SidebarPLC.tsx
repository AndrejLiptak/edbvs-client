import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { Plc } from "../../../graphql/generated";
import { IDevice } from "../../../types";
import { SidebarItem } from "./SidebarItem";

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
            text={`${plc.name}(${plc.id})`}
          />
        ))}
      </Collapse>
    </div>
  );
}
