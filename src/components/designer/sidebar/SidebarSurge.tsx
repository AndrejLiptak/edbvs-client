import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { SurgeProtector } from "../../../graphql/generated";
import { IDevice } from "../../../types";
import { SidebarSurgeType } from "./SidebarSurgeType";

type Props = {
  surgeProtectors: SurgeProtector[];

  addToList: (device: IDevice) => void;
};

export function SidebarSurge({ surgeProtectors, addToList }: Props) {
  const [open, setOpen] = useState(false);

  const typeB = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "B"
  );
  const typeC = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "C"
  );
  const typeD = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "D"
  );
  const typeBC = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "B+C"
  );

  const typeBCD = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "B+C+D"
  );

  const typeCD = surgeProtectors.filter(
    (surgeProtector) => surgeProtector.type == "C+D"
  );

  return (
    <div key={"surgeProtectors"}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        disableGutters
        divider
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="Surge protectors" />
      </ListItemButton>
      <Collapse in={open}>
        <SidebarSurgeType
          addToList={addToList}
          type="Type B"
          surgeProtectors={typeB}
        ></SidebarSurgeType>
        <SidebarSurgeType
          addToList={addToList}
          type="Type C"
          surgeProtectors={typeC}
        ></SidebarSurgeType>
        <SidebarSurgeType
          addToList={addToList}
          type="Type D"
          surgeProtectors={typeD}
        ></SidebarSurgeType>
        <SidebarSurgeType
          addToList={addToList}
          type="Type B+C"
          surgeProtectors={typeBC}
        ></SidebarSurgeType>
        <SidebarSurgeType
          addToList={addToList}
          type="Type B+C+D"
          surgeProtectors={typeBCD}
        ></SidebarSurgeType>
        <SidebarSurgeType
          addToList={addToList}
          type="Type C+D"
          surgeProtectors={typeCD}
        ></SidebarSurgeType>
      </Collapse>
    </div>
  );
}
