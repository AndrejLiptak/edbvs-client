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
import { Enclosure } from "../../../graphql/generated";
import { ChangeEvent } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Edge, Node, ReactFlowInstance, getConnectedEdges } from "reactflow";

type Props = {
  enclosureModalOpen: boolean;
  setEnclosureModalOpen: (value: boolean) => void;
  errorEnclosure: string | undefined;
  placement: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fittingEnclosures: Enclosure[];
  selectedEnclosure: Enclosure | undefined;
  setSelectedEnclosure: (enclosure: Enclosure | undefined) => void;
  setPlacement: (placement: string) => void;
  reactFlowInstance: ReactFlowInstance | null;
  nodes: Node[];
  setWiringNodes: (nodes: Node[]) => void;
  phase: number | undefined;
  edges: Edge[];
  setErrorEnclosure: (id: string | undefined) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setWiringEdges: (edges: Edge[]) => void;
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

export function EnclosureSelection({
  enclosureModalOpen,
  setEnclosureModalOpen,
  errorEnclosure,
  placement,
  handleChange,
  fittingEnclosures,
  selectedEnclosure,
  setSelectedEnclosure,
  setPlacement,
  reactFlowInstance,
  nodes,
  setWiringNodes,
  phase,
  edges,
  setErrorEnclosure,
  setNodes,
  setWiringEdges,
  setEdges,
}: Props) {
  const onConfirmEnclosure = () => {
    reactFlowInstance?.fitView();

    notFitting = false;
    setEnclosureModalOpen(false);
    const copy = nodes.slice();
    setWiringNodes(copy);
    const dinNodes: Node[] = [];
    if (selectedEnclosure === undefined) return;
    for (let i = 1; i <= selectedEnclosure?.totalDIN; i++) {
      dinNodes.push({
        id: `DIN${i}`,
        type: "dinNode",
        deletable: false,
        draggable: false,
        selectable: false,
        position: { x: 0, y: i * 220 - selectedEnclosure?.totalDIN * 110 },
        data: { slots: selectedEnclosure.oneDINSlots, filled: 0 },
      });
    }

    if (!phase) return;
    const phaseNodes: Node[] = [];
    for (let i = 1; i <= phase; i++) {
      const pNode = reactFlowInstance?.getNode(`L${i}`);
      if (!pNode) return;
      phaseNodes.push(pNode);
    }
    phaseNodes.forEach((pNode) => {
      if (!pNode) return;
      const connected = getConnectedEdges([pNode], edges);
      connected.forEach((connection) => {
        var nextNode = reactFlowInstance?.getNode(connection.source);
        if (connection.source == pNode.id) {
          nextNode = reactFlowInstance?.getNode(connection.target);
        }
        if (!nextNode) return;
        recursionSlot(nextNode, dinNodes);
      });
    });

    nodes.forEach((node) => {
      const temp = reactFlowInstance?.getNode(node.id)!;
      if (!temp.data.slotted) recursionSlot(temp, dinNodes);
    });

    if (notFitting) {
      setErrorEnclosure(selectedEnclosure.id);
      setSelectedEnclosure(undefined);
      setEnclosureModalOpen(true);
      copy.forEach((node) => {
        node.data.slotted = false;
      });
      setNodes(copy);

      return;
    }

    setNodes(dinNodes);
    setWiringEdges(edges);
    setErrorEnclosure(undefined);
    setEdges([]);
    reactFlowInstance?.fitView();
    setTimeout(() => {
      reactFlowInstance?.fitView();
    }, 10);
  };

  var currentDIN = 1;
  var notFitting = false;
  const recursionSlot = (node: Node, dinNodes: Node[]) => {
    if (node.data.slotted) return;
    if (notFitting) return;
    if (node.data.label == "L1") return;

    if (
      dinNodes[currentDIN - 1].data.slots -
        dinNodes[currentDIN - 1].data.filled <
      node.data.device.slots
    ) {
      const previousDIN = currentDIN;
      currentDIN += 1;
      if (!selectedEnclosure) return;
      if (currentDIN > selectedEnclosure.totalDIN) currentDIN = 1;
      while (
        dinNodes[currentDIN - 1].data.slots -
          dinNodes[currentDIN - 1].data.filled <
          node.data.device.slots &&
        currentDIN != previousDIN
      ) {
        currentDIN += 1;
        if (currentDIN > selectedEnclosure.totalDIN) currentDIN = 1;
      }
      if (currentDIN == previousDIN) {
        notFitting = true;
        return;
      }
    }

    const x =
      dinNodes[currentDIN - 1].position.x +
      17.5 +
      dinNodes[currentDIN - 1].data.filled * 60;
    const y = dinNodes[currentDIN - 1].position.y - 50;

    node.position = { x, y };

    node.draggable = false;
    node.selectable = false;
    node.deletable = false;
    node.data.slotted = true;
    node.connectable = false;

    dinNodes.push(node);
    dinNodes[currentDIN - 1].data.filled =
      dinNodes[currentDIN - 1].data.filled + node.data.device.slots;

    const connected = getConnectedEdges([node], edges);

    const connectedSorted = connected.sort((a, b) => {
      var currentHandleA = "";
      var currentHandleB = "";

      if (a.source == node.id) currentHandleA = a.sourceHandle!;
      else currentHandleA = a.targetHandle!;

      if (b.source == node.id) currentHandleB = b.sourceHandle!;
      else currentHandleB = b.targetHandle!;

      if (currentHandleA.charAt(0) == currentHandleB.charAt(0)) {
        return (
          Number(currentHandleA.charAt(1)) - Number(currentHandleB.charAt(1))
        );
      }

      if (currentHandleA.charAt(0) == "b") return -1;
      else return 1;
    });

    connectedSorted.forEach((connection) => {
      var nextNode = reactFlowInstance?.getNode(connection.source);
      if (connection.source == node.id) {
        nextNode = reactFlowInstance?.getNode(connection.target);
      }
      if (!nextNode) return;
      recursionSlot(nextNode, dinNodes);
    });
  };

  return (
    <Modal
      open={enclosureModalOpen}
      onClose={() => setEnclosureModalOpen(false)}
      hideBackdrop={true}
    >
      <>
        <Box
          sx={{
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
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "90%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {errorEnclosure && (
              <Typography sx={{ color: "red" }}>
                Could not fit automatically into "{errorEnclosure}" enclosure
              </Typography>
            )}
            <TextField
              id="placement"
              label="Enclosure placement"
              variant="filled"
              select
              required
              onChange={handleChange}
              sx={{ mb: 1 }}
              value={placement}
              SelectProps={{ native: true }}
            >
              {placementOptions.map((input) => (
                <option key={input} value={input}>
                  {input}
                </option>
              ))}
            </TextField>
            <List
              sx={{ overflow: "auto" }}
              dense
              subheader={
                <ListSubheader>
                  <Typography color={"black"}>Fitting Enclosures</Typography>
                </ListSubheader>
              }
            >
              {fittingEnclosures.map((enclosure) => {
                return (
                  <ListItemButton
                    key={enclosure.id}
                    selected={selectedEnclosure?.id == enclosure.id}
                    onClick={() => setSelectedEnclosure(enclosure)}
                  >
                    <ListItemIcon sx={{ mr: -4, ml: -2, width: "10px" }}>
                      {enclosure.isVerified && <VerifiedIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${enclosure.name} (${enclosure.id})`}
                    ></ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          </Box>

          <Button
            sx={{
              position: "absolute",
              bottom: "5px",
              left: "10px",
            }}
            onClick={() => {
              setEnclosureModalOpen(false);
              setSelectedEnclosure(undefined);
              setPlacement(placementOptions[0]);
            }}
          >
            Cancel
          </Button>

          {selectedEnclosure && (
            <Box sx={{ width: "50%" }}>
              <List sx={{ width: "100%" }}>
                <ListItem
                  key={"id"}
                  secondaryAction={
                    <Typography align="right">
                      {selectedEnclosure.id}
                    </Typography>
                  }
                >
                  <ListItemText>ID:</ListItemText>
                </ListItem>
                <ListItem
                  key={"name"}
                  secondaryAction={
                    <Typography align="right">
                      {selectedEnclosure.name}
                    </Typography>
                  }
                >
                  <ListItemText>Name:</ListItemText>
                </ListItem>
                <ListItem
                  key={"heatDissipation"}
                  secondaryAction={
                    <Typography align="right">{`${selectedEnclosure.heatDissipation} W`}</Typography>
                  }
                >
                  <ListItemText>Heat dissipation:</ListItemText>
                </ListItem>
                <ListItem
                  key={"totalDIN"}
                  secondaryAction={
                    <Typography align="right">
                      {selectedEnclosure.totalDIN}
                    </Typography>
                  }
                >
                  <ListItemText>DIN rails:</ListItemText>
                </ListItem>
                <ListItem
                  key={"oneDINSlots"}
                  secondaryAction={
                    <Typography align="right">
                      {selectedEnclosure.oneDINSlots}
                    </Typography>
                  }
                >
                  <ListItemText>Slots on one DIN rail:</ListItemText>
                </ListItem>
                <ListItem
                  key={"totalSlots"}
                  secondaryAction={
                    <Typography align="right">
                      {selectedEnclosure.totalSlots}
                    </Typography>
                  }
                >
                  <ListItemText>Total slots:</ListItemText>
                </ListItem>
                <ListItem
                  key={"link"}
                  secondaryAction={
                    <Link
                      align="right"
                      href={selectedEnclosure.link!}
                      target="_blank"
                    >
                      {selectedEnclosure.id}
                    </Link>
                  }
                >
                  <ListItemText>Link:</ListItemText>
                </ListItem>
              </List>
              <Button
                onClick={onConfirmEnclosure}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                }}
                variant="contained"
              >
                Confirm
              </Button>
            </Box>
          )}
        </Box>
      </>
    </Modal>
  );
}
