import { Typography } from "@mui/material";

type Props = {
    error: boolean,
    success: boolean,
    id: string
}

export function CreateDeviceMessage({error, success, id}: Props) {
  return (
    <>
      {error && (
        <div className="error">
          <Typography>
            Device with ID {id} already exists.
          </Typography>
        </div>
      )}
      {success && (
        <div className="success">
          <Typography>Device created succesfully.</Typography>
        </div>
      )}
    </>
  );
}
