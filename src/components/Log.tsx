import {
  Modal,
  Box,
  List,
  Typography,
  ListItem,
  Button,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import { useState } from "react";
import "../styles/main.css";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  log: string[];
};

export function Log({ log }: Props) {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <>
      {log.length > 0 && (
        <Button
          onClick={() => {
            setLogOpen(true);
          }}
         
        >
          See log
        </Button>
      )}
      <Modal open={logOpen} onClose={() => setLogOpen(false)}>
        <Box className="Log" sx={{display: 'flex', flexDirection: 'column', maxHeight: '50%'}}>
          <Typography variant="h6">
            Log
            <IconButton
              onClick={() => setLogOpen(false)}
              sx={{ position: "fixed", right: "10%" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <List sx={{flexGrow: 1, overflow: 'auto'}}>
            {log.map((logItem, index) => {
              return (
                <>
                  <ListItem key={index} sx={{ display: "list-item" }}>
                    <ListItemText primary={logItem} />
                  </ListItem>
                  <Divider />
                </>
              );
            })}
          </List>
        </Box>
      </Modal>
    </>
  );
}
