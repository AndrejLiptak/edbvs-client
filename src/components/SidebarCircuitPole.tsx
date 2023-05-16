import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { CircuitBreaker } from "../graphql/generated";
import { IDevice, UserWithoutDevices } from "../types";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { SidebarItem } from "./SidebarItem";

type Props = {
  circuitBreakers: CircuitBreaker[];
  poles: string,
  addToList: (device: IDevice) => void;
};

export function SidebarPole({ circuitBreakers, addToList, poles }: Props) {

    
    
    const [open, setOpen] = useState(false)
    const sortedArray = circuitBreakers.sort((a,b) => {
      if (a.isVerified === b.isVerified) {
        return Number(a.ratedCurrent) - Number(b.ratedCurrent);
      }
      return Number(b.isVerified) - Number(a.isVerified);
    });
  return (
    <div key={poles}>
      <ListItemButton
        onClick={() => {
          setOpen(!open);
        }}
        key={`${poles}button`}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText primary={poles} />
      </ListItemButton>
      <Collapse in={open}>
        {sortedArray.map((circuitBreaker: CircuitBreaker) => (
          <SidebarItem
            addToList={addToList}
            device={circuitBreaker}
            text={`${circuitBreaker.name}(${circuitBreaker.id}), ${circuitBreaker.type}, ${circuitBreaker.ratedCurrent}A` }
            key={`${circuitBreaker.id}${circuitBreaker.__typename}`}
          />
        ))}
      </Collapse>
    </div>
  );
}
