import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";

type Props = {
    section: React.ReactNode,
    header: string
}

export function ProfileListSection({section, header} : Props) {
    const [open, setOpen] = useState(false)
    return(
        <>
        
        <ListItemButton
        key={header}
        onClick={() => {
          setOpen(!open);
        }}
        divider
      >
        <ListItemText primary={header} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open}>
        {section}
      </Collapse>
      </>
    )
}