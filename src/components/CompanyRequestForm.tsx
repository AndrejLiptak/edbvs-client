import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChangeEvent, FormEvent, useState } from "react";

type Props = {
  handleOpen: (open: boolean) => void;
  onSubmit:  (event: FormEvent<HTMLFormElement>, {companyName, companyICO} : {companyName: string, companyICO: string}) => void;
};

export function CompanyRequestForm({ handleOpen, onSubmit }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let value: (typeof requestModify)[keyof typeof requestModify] =
      event.target.value;
    setRequestModify({ ...requestModify, [event.target.id]: value });
  }

  const [requestModify, setRequestModify] = useState({
    companyName: "",
    companyICO: "",
  });
  return (
    <Box className="CreateBox" component="form" onSubmit={(event) => onSubmit(event, requestModify)}>
      <Typography variant="h6">
        Company account request form
        <IconButton
          onClick={() => handleOpen(false)}
          sx={{ position: "fixed", right: "5%" }}
        >
          <CloseIcon />
        </IconButton>
      </Typography>
      <div>
        <TextField
          id="companyICO"
          label="ICO"
          variant="standard"
          type="number"
          required
          onChange={handleChange}
          value={requestModify.companyICO}
          className="id"
          sx={{ pr: 1 }}
          InputProps={{ inputProps: { autoComplete: "off" } }}
        />
        <TextField
          id="companyName"
          label="Company name"
          variant="standard"
          required
          onChange={handleChange}
          value={requestModify.companyName}
          className="name"
          InputProps={{ inputProps: { autoComplete: "off" } }}
        />
      </div>
      <Button sx={{ mt: 3 }} type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
}
