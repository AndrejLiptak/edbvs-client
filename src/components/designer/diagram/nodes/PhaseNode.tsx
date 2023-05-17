import { Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "reactflow";
import "../../../../styles/deviceNode.css";
import { PhaseData } from "../../../../types";

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
