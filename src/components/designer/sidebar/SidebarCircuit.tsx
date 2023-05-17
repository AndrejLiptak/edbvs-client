import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { CircuitBreaker } from "../../../graphql/generated";
import { IDevice, UserWithoutDevices } from "../../../types";
import { SidebarPole } from "./SidebarCircuitPole";

type Props = {
  circuitBreakers: CircuitBreaker[];
  addToList: (device: IDevice) => void;
};

export function SidebarCircuit({ circuitBreakers, addToList }: Props) {
  const [open, setOpen] = useState(false);

  const pole3 = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "3"
  );
  const pole1 = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "1"
  );
  const pole1n = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "1+N"
  );
  const pole2 = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "2"
  );
  const pole3n = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "3+N"
  );
  const pole4 = circuitBreakers.filter(
    (circuitBreaker) => circuitBreaker.poleCount == "4"
  );
  return (
    <div key={"circuitBreakers"}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        disableGutters
        divider
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary="Circuit breakers" />
      </ListItemButton>
      <Collapse in={open}>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole1}
          poles="1 Pole"

        ></SidebarPole>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole1n}
          poles="1+N Pole"
 
        ></SidebarPole>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole2}
          poles="2 Pole"
        
        ></SidebarPole>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole3}
          poles="3 Pole"
        
        ></SidebarPole>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole3n}
          poles="3+N Pole"
        
        ></SidebarPole>
        <SidebarPole
          addToList={addToList}
          circuitBreakers={pole4}
          poles="4 Pole"
          
        ></SidebarPole>
      </Collapse>
    </div>
  );
}
