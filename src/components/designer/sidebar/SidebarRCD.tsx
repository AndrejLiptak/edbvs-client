import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { Rcd } from "../../../graphql/generated";
import { IDevice } from "../../../types";
import { SidebarItem } from "./SidebarItem";

type Props = {
  RCDs: Rcd[];

  addToList: (device: IDevice) => void;
};

export function SidebarRCD({ RCDs, addToList }: Props) {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open4, setOpen4] = useState(false);

  const pole2 = RCDs.filter((rcd) => rcd.poleCount == "2");
  const sorted2 = pole2.sort((a, b) => {
    if (a.isVerified === b.isVerified) {
      return Number(a.ratedResidualCurrent) - Number(b.ratedResidualCurrent);
    }
    return Number(b.isVerified) - Number(a.isVerified);
  });

  const pole4 = RCDs.filter((rcd) => rcd.poleCount == "4");
  const sorted4 = pole4.sort((a, b) => {
    if (a.isVerified === b.isVerified) {
      return Number(a.ratedResidualCurrent) - Number(b.ratedResidualCurrent);
    }
    return Number(b.isVerified) - Number(a.isVerified);
  });
  return (
    <div key={"RCDs"}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        disableGutters
        divider
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="RCDs" />
      </ListItemButton>
      <Collapse in={open}>
        <ListItemButton
          onClick={() => {
            setOpen2(!open2);
          }}
          key={"rcd2"}
        >
          {open2 ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={"2 Pole"} />
        </ListItemButton>
        <Collapse in={open2}>
          {sorted2.map((rcd: Rcd) => (
            <SidebarItem
              addToList={addToList}
              device={rcd}
              text={`${rcd.name}(${rcd.id}), ${rcd.currentType}, ${rcd.breakTimeType},  ${rcd.ratedResidualCurrent}mA, ${rcd.ratedCurrent}A`}
              key={`${rcd.id}RCD`}
            />
          ))}
        </Collapse>
        <ListItemButton
          onClick={() => {
            setOpen4(!open4);
          }}
          key={"rcd4"}
        >
          {open4 ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={"4 Pole"} />
        </ListItemButton>
        <Collapse in={open4}>
          {sorted4.map((rcd: Rcd) => (
            <SidebarItem
              addToList={addToList}
              device={rcd}
              text={`${rcd.name}(${rcd.id}), ${rcd.currentType}, ${rcd.breakTimeType},  ${rcd.ratedResidualCurrent}mA, ${rcd.ratedCurrent}A`}
              key={`${rcd.id}RCD`}
            />
          ))}
        </Collapse>
      </Collapse>
    </div>
  );
}
