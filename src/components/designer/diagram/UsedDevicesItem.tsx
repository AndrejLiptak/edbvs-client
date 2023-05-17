import DeleteIcon from "@mui/icons-material/Delete";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IDevice } from "../../../types";
import { DeviceDetail } from "../DeviceDetail";

type Props = {
  deviceList: Map<IDevice, number>;
  deleteDevice: (device: IDevice) => void;
  addToList: (device: IDevice) => void;
  device: IDevice;
};

export function UsedDeviceItem({
  device,
  deviceList,
  deleteDevice,
  addToList,
}: Props) {
  const [open, setOpen] = useState(false);
  const key = device.id + device.__typename;
  const count = deviceList.get(device)!;

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    device: IDevice,
    key: string
  ) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(device));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <ListItem
        key={key}
        secondaryAction={
          (count > 0 && <Typography sx={{ mr: 1 }}>{count}</Typography>) ||
          (count == 0 && (
            <>
              <IconButton onClick={() => deleteDevice(device)} sx={{ mr: -1 }}>
                <DeleteIcon />
              </IconButton>
            </>
          ))
        }
      >
        <ListItemButton
          onDragStart={(event) => onDragStart(event, device, key)}
          onClick={() => setOpen(!open)}
          draggable
        >
          <ListItemText
            sx={{ wordWrap: "break-word" }}
            primary={`${device.name}(${device.id})`}
          ></ListItemText>
        </ListItemButton>
      </ListItem>
      <Divider></Divider>
      <DeviceDetail
        addToList={addToList}
        device={device}
        openIn={open}
        handleClose={setOpen}
      />
    </>
  );
}
