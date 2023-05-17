import { Handle, NodeProps, Position } from "reactflow";
import { PhaseData } from "../../../../types";
import "../../../../styles/deviceNode.css"
import { Typography } from "@mui/material";

export function PhaseNode({ data }: NodeProps<PhaseData>) {
  return (
    <div className="phaseNode">
      <Handle type="source" id={data.label} position={Position.Bottom} />
      <Typography align="center" sx={{ pt: "15px" }}>
        {data.label}
      </Typography>
    </div>
  );
}
