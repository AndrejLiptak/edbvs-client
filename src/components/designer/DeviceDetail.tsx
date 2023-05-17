import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Box,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IDevice, UserWithoutDevices } from "../../types";

type Props = {
  device: IDevice;
  addToList: (device: IDevice) => void;
  handleClose: (open: boolean) => void
  openIn: boolean;
};

export function DeviceDetail({ device, addToList, openIn, handleClose }: Props) {
  const [open, setOpen] = useState(openIn);
  const email = device.userEmail;
  useEffect(() => {
    setOpen(openIn)
  },[openIn])

  return (
    <>

      <Modal open={open} onClose={() => handleClose(false)}>
        <Box className={"CreateBox"}>
          <Typography variant="h6">
            {device.__typename}
            {device.isVerified && <VerifiedIcon color="primary" />}{" "}
            <IconButton
              onClick={() =>handleClose(false)}
              sx={{ position: "fixed", right: "5%" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <List>
            <ListItem
              divider
              secondaryAction={<Typography>{device.id}</Typography>}
            >
              <ListItemText primary={"ID:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={<Typography>{device.name}</Typography>}
            >
              <ListItemText primary={"Name:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={
                <Typography>
                  {
                    <>
                      {device.userEmail}{" "}
                      
                    </>
                  }
                </Typography>
              }
            >
              <ListItemText primary={"Created by:"} />
            </ListItem>
            {"poleCount" in device && (
              <ListItem
                divider
                secondaryAction={<Typography>{device.poleCount}</Typography>}
              >
                <ListItemText primary={"Pole count:"} />
              </ListItem>
            )}
            {"ratedCurrent" in device && (
              <ListItem
                divider
                secondaryAction={
                  <Typography>{`${device.ratedCurrent} A`}</Typography>
                }
              >
                <ListItemText primary={"Rated current:"} />
              </ListItem>
            )}
            {"type" in device && (
              <ListItem
                divider
                secondaryAction={<Typography>{device.type}</Typography>}
              >
                <ListItemText primary={"Type:"} />
              </ListItem>
            )}
            {"ratedResidualCurrent" in device && (
              <ListItem
                divider
                secondaryAction={
                  <Typography>{`${device.ratedResidualCurrent} mA`}</Typography>
                }
              >
                <ListItemText primary={"Rated residual current:"} />
              </ListItem>
            )}
            {"currentType" in device && (
              <ListItem
                divider
                secondaryAction={<Typography>{device.currentType}</Typography>}
              >
                <ListItemText primary={"Break time type:"} />
              </ListItem>
            )}
                        {"breakTimeType" in device && (
              <ListItem
                divider
                secondaryAction={<Typography>{device.breakTimeType}</Typography>}
              >
                <ListItemText primary={"Type:"} />
              </ListItem>
            )}
            <ListItem
              divider
              secondaryAction={
                <Typography>{`${device.powerLoss} W`}</Typography>
              }
            >
              <ListItemText primary={"Power loss:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={
                <Typography>{`${device.maxTemp} °C`}</Typography>
              }
            >
              <ListItemText primary={"Maximum temperature:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={<Typography>{device.slots}</Typography>}
            >
              <ListItemText primary={"Slots on DIN:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={<Typography>{device.inputs}</Typography>}
            >
              <ListItemText primary={"Inputs:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={<Typography>{device.outputs}</Typography>}
            >
              <ListItemText primary={"Outputs:"} />
            </ListItem>
            <ListItem
              divider
              secondaryAction={<Link href={device.link!} target="_blank">{device.id}</Link>}
            >
              <ListItemText primary={"Link:"} />
            </ListItem>
          </List>
          <IconButton
            sx={{}}
            onClick={() => {
              addToList(device);
              handleClose(false);
            }}
          >
           <AddCircleOutlineIcon color="success" fontSize="large" />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
}
