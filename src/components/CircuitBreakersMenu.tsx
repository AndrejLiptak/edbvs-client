import { ICircuitBreaker, IDevice } from "../types";
import { Button, CircularProgress, ListItemButton } from "@mui/material";
import { useQuery } from "urql";
import VerifiedIcon from "@mui/icons-material/Verified";

type Props = {
  device: ICircuitBreaker;
  addToList: (device: IDevice) => void;
};

const UserQuerry = `
  query($email: String!) {
  User(email: $email) {

      isVerified

      }
  }
  `;

export function CircuitBreakerDisplay({ device, addToList }: Props) {
  const email = device.userEmail;

  const [userInDb] = useQuery({
    query: UserQuerry,
    variables: { email },
  });

  if (userInDb.fetching) return <CircularProgress />;
  return (
    <ListItemButton key={device.id}>
      {device.id} - {device.name}{" "}
      {userInDb.data.User.isVerified && <VerifiedIcon />}
      <Button onClick={() => addToList(device)}>Add</Button>
    </ ListItemButton>
  );
}
