import { Box, Popover } from "@mui/material";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { CustomNode } from "./nodes/DeviceNode";

type Props = {
  nodes: CustomNode[];
  setNodes: (nodes: CustomNode[]) => void;
  type: string;
  setColorDevice: (color: string) => void;
  colorInitial: string;
};

export function ColorPicker({
  nodes,
  setNodes,
  type,
  setColorDevice,
  colorInitial,
}: Props) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // for color picker popup
  const [color, setColor] = useState(colorInitial);
 
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleChange = (color: string) => {
    setColorDevice(color);

    // whole data property needs to be updated for the change to render immediately
    setNodes(
      nodes.map((node) => {
        if (node.data.device && node.data.device.__typename == type) {
          node.data = {
            ...node.data,
            color: color,
          };
          return node;
        }
        return node;
      })
    );
  };

  return (
    <div style={{ paddingRight: "10px" }}>
      <button
        aria-describedby={id}
        onClick={handleClick}
        style={{
          padding: "1px",
          background: `white`,
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
          flexGrow: 0,
        }}
      >
        <Box
          sx={{
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            background: `${color}`,
          }}
        ></Box>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker
          color={color}
          onChange={(color) => setColor(color.hex)}
          disableAlpha={true}
          onChangeComplete={(color) => handleChange(color.hex)}
        ></ChromePicker>
      </Popover>
    </div>
  );
}
