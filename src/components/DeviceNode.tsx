import { Handle, Position, Node, NodeProps } from "reactflow";
import { IDevice, NodeData } from "../types";
import { Divider, Typography } from "@mui/material";
import "../styles/deviceNode.css";
import { useEffect } from "react";

type Props = {
  inputs: number;
  width: number;
};

export type CustomNode = Node<NodeData>;

export function DeviceNode({ data }: NodeProps<NodeData>) {

  function TopHandles({ inputs, width }: Props) {
    var handels = [];
    for (var i = 0; i < inputs; i++) {
      const spacing = (width * 60) / (inputs + 1);
      handels.push(
        <>
          <Handle
            type="source"
            key={i}
            id={"t" + i.toString()}
            position={Position.Top}
            style={{ left: `${spacing * (i + 1)}px` }}
          />
          {data.device.__typename == "PLC" && (
            <Typography
              sx={{
                pl: `${spacing * (i + 1) - 10}px`,
                position: "fixed",
                fontSize: "10px",
                pt: "5px",
              }}
            >
              {i + 1 <= data.device.digitalIn && `DI ${i + 1}`}
              {i + 1 > data.device.digitalIn &&
                `AI ${i + 1 - data.device.digitalIn}`}
            </Typography>
          )}
        </>
      );
    }
    return <>{handels}</>;
  }

  function BottomHandles({ inputs, width }: Props) {
    var handels = [];
    for (var i = 0; i < inputs; i++) {
      const spacing = (width * 60) / (inputs + 1);
      handels.push(
        <>
          {data.device.__typename == "PLC" && (
            <Typography
              sx={{
                pl: `${spacing * (i + 1) - 10}px`,
                position: "fixed",
                fontSize: "10px",
                bottom: '5px'
              }}
            >
              {i + 1 <= data.device.digitalOut && `DI ${i + 1}`}
              {i + 1 > data.device.digitalOut &&
                `AI ${i + 1 - data.device.digitalOut}`}
            </Typography>
          )}
          <Handle
            type="source"
            key={i}
            id={`b` + i.toString()}
            position={Position.Bottom}
            style={{ left: `${spacing * (i + 1)}px` }}
          />
        </>
      );
    }

    return <>{handels}</>;
  }
  const style = {
    background: `${data.color}`,
    color: `#000`,
    //boxShadow: "0px 3px 10px rgba(0,0,0,0.25)",
   

    width: `${data.device.slots * 60}px`,
    height: `${200}px`,
    borderStyle: "solid",
    borderWidth: "thin",
  };

  return (
    <div style={style}>
      <TopHandles inputs={data.device.inputs} width={data.device.slots} />

      {data.device.__typename != "PLC" && (
        <Typography align="center" sx={{ position: 'fixed', transform: `translate(-50%, -50%)`, top: '5%', left: '50%', fontSize: '10px',  }}>
          in
        </Typography>
      )}


      <Typography align="center"  sx={{ position: 'relative', transform: `translate(-50%, -50%)`, top: '50%', left: '50%', fontSize: `12px`, wordWrap: "break-word" }}>
        {`${data.device.id}`}{" "}
      </Typography>
      <Typography  align="center" sx={{ position: 'relative', transform: `translate(-50%, -50%)`, top: '50%', left: '50%', fontSize: `12px` }}>
        {`${data.order}`}{" "}
      </Typography>

      
      {data.device.__typename != "PLC" && (
        <Typography align="center" sx={{ position: 'fixed', transform: `translate(-50%, 50%)`, bottom: '5%', left: '50%', fontSize: '10px' }}>
          out
        </Typography>
      )}
      
      <BottomHandles inputs={data.device.outputs} width={data.device.slots} />
    </div>
  );
}
