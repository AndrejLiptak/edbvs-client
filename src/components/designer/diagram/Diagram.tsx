import {
  Edge,
  Connection,
  ReactFlowInstance,
  Node,
  NodeProps,
} from "@reactflow/core";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Background,
  ConnectionLineType,
  Controls,
  ReactFlowProps,
  ReactFlowProvider,
  addEdge,
  getConnectedEdges,
  getOutgoers,
  isEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  DINData,
  IDevice,
  NodeData,
  UserWithoutDevices,
  nodeTypes,
} from "../../../types";
import ReactFlow from "reactflow";
import "../../../styles/diagram.css";
import "reactflow/dist/style.css";
import { ConnectionMode } from "reactflow";
import { UsedDevices } from "./UsedDevices";
import { SmartStepEdge, SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { CustomNode, DeviceNode } from "./nodes/DeviceNode";
import { PhaseNode } from "./nodes/PhaseNode";
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { isNode } from "graphql/language/ast";
import { Enclosure, useEnclosuresQuery } from "../../../graphql/generated";
import { PhaseSelection } from "./PhaseSelection";
import { DINNode } from "./nodes/DINNode";
import { DownloadDocument, createPNG } from "./DownloadDocument";
import { EnclosureSelection } from "./EnclosureSelection";

type Props = {
  deviceList: Map<IDevice, number>;
  deleteDevice: (device: IDevice) => void;
  totalPowerLoss: number;
  setDeviceList: (deviceList: Map<IDevice, number>) => void;
  setTotalPowerLoss: (powerLoss: number) => void;
  addToList: (device: IDevice) => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "40%",
  minHeight: 350,
  display: "flex",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const placementOptions = [
  "Free standing",
  "Next to wall from back",
  "Next to wall from one side",
  "Next to wall from both sides",
  "Next to wall from back and one side",
  "Next to wall from back and both sides",
  "Next to wall from back, both sides and blocked on top",
];

export function Diagram({
  deviceList,
  deleteDevice,
  setDeviceList,
  addToList,
}: Props) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [phase, setPhase] = useState<number>();
  const [totalPowerLoss, setTotalPowerLoss] = useState(0);
  const [totalDINSlots, setTotalDINSlots] = useState(0);
  const [enclosureModalOpen, setEnclosureModalOpen] = useState(false);
  const [fittingEnclosures, setFittingEnclosures] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] = useState<Enclosure>();
  const [wiringNodes, setWiringNodes] = useState<Node[]>([]);
  const [wiringEdges, setWiringEdges] = useState<Edge[]>([]);
  const [errorEnclosure, setErrorEnclosure] = useState<string>();
  const [wiringDiagram, setWiringDiagram] = useState<string>("");
  const [placenment, setPlacement] = useState(placementOptions[0]);
  const [biggestSlot, setBiggestSlot] = useState(0);
  const [colorCircuit, setColorCircuit] = useState("#fff");
  const [colorRCD, setColorRCD] = useState("#fff");
  const [colorSurge, setColorSurge] = useState("#fff");
  const [colorPLC, setColorPLC] = useState("#fff");
  const [colorGeneric, setColorGeneric] = useState("#fff");

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (selectedEnclosure) return;
      if (!reactFlowWrapper || !reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const deviceJSON = event.dataTransfer.getData("application/reactflow");

      if (typeof deviceJSON === "undefined" || !deviceJSON) return;
      if (!reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const deviceTemp: IDevice = JSON.parse(deviceJSON);

      const arraysOfKeys = Array.from(deviceList.keys());

      const tempDevices = arraysOfKeys.filter((v, i) => {
        return (
          v["id"] == deviceTemp.id && v["__typename"] == deviceTemp.__typename
        );
      });

      const device = tempDevices[0];
      var numbers = deviceList.get(device);

      if (typeof numbers === undefined) return;

      numbers ??= 0;
      deviceList.set(device, numbers + 1);
      const usedOrder: number[] = [];
      nodes.forEach((node) => {
        if (node.data.device && node.data.device.id == device.id)
          usedOrder.push(node.data.order);
      });

      usedOrder.sort((a, b) => {
        return a - b;
      });

      var lowest = 0;
      for (let i = 0; i < usedOrder.length; i++) {
        if (usedOrder[i] != i + 1) {
          lowest = i + 1;
          break;
        }
      }
      if (lowest == 0) lowest = usedOrder.length + 1;

      setTotalPowerLoss(totalPowerLoss + device.powerLoss * 100);
      setTotalDINSlots(totalDINSlots + device.slots);
      setDeviceList(new Map(deviceList));
      const key = device.id + "," + lowest + "," + device.__typename;

      var color = "";
      switch (device.__typename) {
        case "CircuitBreaker":
          color = colorCircuit;
          break;
        case "RCD":
          color = colorRCD;
          break;
        case "SurgeProtector":
          color = colorSurge;
          break;
        case "PLC":
          color = colorPLC;
          break;
        case "GenericDevice":
          color = colorGeneric;
          break;
      }

      const newNode = {
        id: key,
        type: "deviceNode",
        position: position,
        connectable: true,
        data: {
          device: device,
          slotted: false,
          order: lowest,
          color: color,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [
      reactFlowInstance,
      deviceList,
      totalPowerLoss,
      selectedEnclosure,
      colorCircuit,
      colorGeneric,
      colorPLC,
      colorRCD,
      colorSurge,
    ]
  );

  const onNodeDelete = useCallback(
    (nodes: Node[]) => {
      var newPowerLoss = totalPowerLoss;
      var newDINSlots = totalDINSlots;
      nodes.forEach((node) => {
        const device = node.data.device;

        if (!device) return;
        const numbers = deviceList.get(device);
        if (!numbers) return;
        deviceList.set(device, numbers - 1);
        newPowerLoss = newPowerLoss - device.powerLoss * 100;
        newDINSlots = newDINSlots - device.slots;
      });
      setTotalPowerLoss(newPowerLoss);
      setTotalDINSlots(newDINSlots);
      setDeviceList(new Map(deviceList));
    },
    [deviceList]
  );

  const onSetPhases = (number: number) => {
    setPhase(number);
    const initialNodes = [];
    const L1Node = {
      id: "L1",
      type: "phaseNode",
      position: { x: 0, y: 0 },
      deletable: false,
      draggable: false,
      selectable: false,
      data: { label: `L1`, slotted: true },
    };
    initialNodes.push(L1Node);
    if (number == 3) {
      const L2Node = {
        id: "L2",
        type: "phaseNode",
        position: { x: 100, y: 0 },
        deletable: false,
        draggable: false,
        selectable: false,
        data: { label: `L2`, slotted: true },
      };
      const L3Node = {
        id: "L3",
        type: "phaseNode",
        position: { x: 200, y: 0 },
        deletable: false,
        draggable: false,
        selectable: false,
        data: { label: `L3`, slotted: true },
      };
      initialNodes.push(L2Node);
      initialNodes.push(L3Node);
    }
    setNodes(initialNodes);
    setEdges([]);
    setDeviceList(new Map<IDevice, number>());
    setTotalDINSlots(0);
    setTotalPowerLoss(0);
    setSelectedEnclosure(undefined);
  };

  const edgeTypes = useMemo(() => ({ default: SmartStepEdge }), []);

  const nodeTypes = useMemo(
    () => ({ deviceNode: DeviceNode, phaseNode: PhaseNode, dinNode: DINNode }),
    []
  );

  const onNextStep = () => {
    createPNG(reactFlowInstance, (base64String) => {
      setWiringDiagram(base64String);
    });
    setEnclosureModalOpen(true);
    var tempbiggestSlot = 0;
    nodes.forEach((node) => {
      if (node.data.device && node.data.device.slots > biggestSlot)
        tempbiggestSlot = node.data.device.slots;
    });

    const enclosures = enclosuresAll?.filter((enclosure) => {
      return (
        enclosure.totalSlots >= totalDINSlots &&
        enclosure.oneDINSlots >= biggestSlot &&
        enclosure.heatDissipation >= totalPowerLoss / 100
      );
    });
    if (!enclosures) return;
    setFittingEnclosures(
      enclosures.sort((a, b) => Number(b.isVerified) - Number(a.isVerified))
    );
    setBiggestSlot(tempbiggestSlot);
    if (enclosures.length > 0) setSelectedEnclosure(enclosures[0]);
  };

  const onReturnToDesigner = () => {
    setSelectedEnclosure(undefined);
    wiringNodes.forEach((node) => {
      node.data.slotted = false;
      node.draggable = true;
      node.selectable = true;
      node.deletable = true;
    });
    setNodes(wiringNodes);
    setEdges(wiringEdges);
    setWiringEdges([]);

    reactFlowInstance?.fitView();
    setTimeout(() => {
      reactFlowInstance?.fitView();
    }, 10);
    setPlacement(placementOptions[0]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    setPlacement(value);
    var placemenentModifier = 0;
    switch (value) {
      case placementOptions[0]:
        placemenentModifier = 1;
        break;
      case placementOptions[1]:
        placemenentModifier = 0.9;
        break;
      case placementOptions[2]:
        placemenentModifier = 0.925;
        break;
      case placementOptions[3]:
        placemenentModifier = 0.85;
        break;
      case placementOptions[4]:
        placemenentModifier = 0.825;
        break;
      case placementOptions[5]:
        placemenentModifier = 0.76;
        break;
      case placementOptions[6]:
        placemenentModifier = 0.7;
        break;
    }

    const newEnclosures = enclosuresAll!.filter(
      (enclosure) =>
        enclosure.totalSlots >= totalDINSlots &&
        enclosure.oneDINSlots >= biggestSlot &&
        enclosure.heatDissipation * placemenentModifier >= totalPowerLoss / 100
    );
    setFittingEnclosures(
      newEnclosures.sort((a, b) => Number(b.isVerified) - Number(a.isVerified))
    );
    setSelectedEnclosure(newEnclosures[0]);
  };

  const enclosuresQuery = useEnclosuresQuery();
  const enclosuresAll = enclosuresQuery[0].data?.Enclosures;

  return (
    <div className="diagram">
      <UsedDevices
        deviceList={deviceList}
        deleteDevice={deleteDevice}
        totalPowerLoss={totalPowerLoss}
        totalDINSlots={totalDINSlots}
        addToList={addToList}
        nodes={nodes}
        setNodes={setNodes}
        setColorCircuit={setColorCircuit}
        setColorGeneric={setColorGeneric}
        setColorSurge={setColorSurge}
        setColorRCD={setColorRCD}
        setColorPLC={setColorPLC}
        colorCircuit={colorCircuit}
        colorGeneric={colorGeneric}
        colorPLC={colorPLC}
        colorRCD={colorRCD}
        colorSurge={colorSurge}
      />
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          {phase && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodesDelete={onNodeDelete}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.Step}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              minZoom={0.2}
              connectionMode={ConnectionMode.Loose}
            >
              <Background />
              <Controls />
            </ReactFlow>
          )}
        </div>

        <PhaseSelection
          setPhaseCount={onSetPhases}
          phase={phase}
        ></PhaseSelection>
        {!selectedEnclosure && (
          <Button
            variant="contained"
            onClick={onNextStep}
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "1rem",
              width: "10rem",
            }}
          >
            Select Enclosure
          </Button>
        )}
        {selectedEnclosure && (
          <Button
            variant="contained"
            onClick={onReturnToDesigner}
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "23rem",
              width: "10rem",
            }}
          >
            Return to designer
          </Button>
        )}
        {selectedEnclosure && (
          <DownloadDocument
            wiringDiagram={wiringDiagram}
            reactFlowInstance={reactFlowInstance}
            selectedEnclosure={selectedEnclosure}
            powerLoss={totalPowerLoss}
            filledSlots={totalDINSlots}
            phaseCount={phase!}
            deviceList={deviceList}
          />
        )}
        <EnclosureSelection
          enclosureModalOpen={enclosureModalOpen}
          errorEnclosure={errorEnclosure}
          fittingEnclosures={fittingEnclosures}
          handleChange={handleChange}
          placement={placenment}
          selectedEnclosure={selectedEnclosure}
          setEnclosureModalOpen={setEnclosureModalOpen}
          setPlacement={setPlacement}
          setSelectedEnclosure={setSelectedEnclosure}
          edges={edges}
          nodes={nodes}
          phase={phase}
          reactFlowInstance={reactFlowInstance}
          setEdges={setEdges}
          setErrorEnclosure={setErrorEnclosure}
          setNodes={setNodes}
          setWiringEdges={setWiringEdges}
          setWiringNodes={setWiringNodes}
        ></EnclosureSelection>
      </ReactFlowProvider>
    </div>
  );
}
