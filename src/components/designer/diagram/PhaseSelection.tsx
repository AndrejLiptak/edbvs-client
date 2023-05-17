import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import onePhase from "../../../images/1phase.png";
import threePhase from "../../../images/3phase.png";

type Props = {
  setPhaseCount: (device: number) => void;
  phase: number | undefined;
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 410,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function PhaseSelection({ setPhaseCount, phase }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          position: "absolute",
          bottom: "20px",
          right: "12rem",
          width: "10rem",
        }}
      >
        Phase Select (Reset)
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        hideBackdrop={true}
      >
        <Box sx={style}>
          <Typography align="center" variant="h6">
            Select number of phases
          </Typography>
          {phase && (
            <Typography align="center" sx={{ color: "#ff9800" }}>
              WARNING: This will reset your diagram
            </Typography>
          )}
          <Button
            onClick={() => {
              setPhaseCount(1);
              setOpen(false);
            }}
          >
            <img src={onePhase}></img>
          </Button>
          <Button
            onClick={() => {
              setPhaseCount(3);
              setOpen(false);
            }}
          >
            <img src={threePhase}></img>
          </Button>
          {phase && (
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              cancel
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
}
