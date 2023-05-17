import { Box } from "@mui/material";
import { NodeProps } from "reactflow";
import "../../../../styles/deviceNode.css";
import { DINData } from "../../../../types";

export function DINNode({ data }: NodeProps<DINData>) {
  const width = data.slots * 60 + 35;
  return (
    <Box sx={{ width: width, border: "2px solid #000", height: "100px" }}>
      <Box
        sx={{
          width: width - 20,
          border: "2px solid #000",
          height: "80px",
          mt: "8px",
          ml: "8px",
        }}
      ></Box>
    </Box>
  );
}
