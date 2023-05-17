import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { GenericDevice } from "../../../graphql/generated";
import { IDevice } from "../../../types";
import { SidebarItem } from "./SidebarItem";

type Props = {
  genericDevices: GenericDevice[];
  addToList: (device: IDevice) => void;
};

export function SidebarGeneric({ genericDevices, addToList }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div key={"genericDevices"}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        disableGutters
        divider
        key={"genericDevicesButton"}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="Generic devices" />
      </ListItemButton>
      <Collapse in={open} key={"genericDevicesCollapse"}>
        {genericDevices.map((device: GenericDevice) => (
          <SidebarItem
            addToList={addToList}
            device={device}
            text={`${device.name}(${device.id})`}
            key={`${device.id}${device.__typename}`}
          />
        ))}
      </Collapse>
    </div>
  );
}
