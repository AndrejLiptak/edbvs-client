import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { IDevice } from "../../../types";
import { DeviceDetail } from "../DeviceDetail";

type Props = {
  device: IDevice;
  addToList: (device: IDevice) => void;
  text: string;
};

export function SidebarItem({ device, addToList, text }: Props) {
  const [open, setOpen] = useState(false);
  const email = device.userEmail;
  return (
    <ListItem
      key={`${device.__typename}${device.id}`}
      secondaryAction={
        <IconButton sx={{ mr: -3, ml: -3 }} onClick={() => addToList(device)}>
          <AddCircleOutlineIcon color="success" />
        </IconButton>
      }
    >
      <ListItemButton key={device.id} onClick={() => setOpen(!open)}>
        <ListItemIcon sx={{ mr: -3, ml: -3 }}>
          {device.isVerified && <VerifiedIcon color="secondary" />}
        </ListItemIcon>
        <ListItemText style={{ wordWrap: "break-word" }}>{text}</ListItemText>
      </ListItemButton>
      <DeviceDetail
        addToList={addToList}
        device={device}
        openIn={open}
        handleClose={setOpen}
      />
    </ListItem>
  );
}
