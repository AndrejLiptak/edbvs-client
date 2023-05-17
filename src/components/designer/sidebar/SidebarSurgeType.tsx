import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { SurgeProtector } from "../../../graphql/generated";
import { IDevice } from "../../../types";
import { SidebarItem } from "./SidebarItem";

type Props = {
  surgeProtectors: SurgeProtector[];
  type: string;

  addToList: (device: IDevice) => void;
};

export function SidebarSurgeType({ surgeProtectors, addToList, type }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        key={type}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary={type} />
      </ListItemButton>
      <Collapse in={open}>
        {surgeProtectors.map((surgeProtector: SurgeProtector) => (
          <SidebarItem
            addToList={addToList}
            device={surgeProtector}
            key={`${surgeProtector.id}surgeProtector`}
            text={`${surgeProtector.name}(${surgeProtector.id}), ${surgeProtector.slots}\u00A0slot, ${surgeProtector.inputs}\u00A0in, ${surgeProtector.outputs}\u00A0out`}
          />
        ))}
      </Collapse>
    </>
  );
}
