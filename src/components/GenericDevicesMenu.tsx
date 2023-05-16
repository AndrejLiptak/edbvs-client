import { IDevice } from "../types";
import { Button, CircularProgress, ListItemButton } from "@mui/material";
import { useQuery } from "urql";
import VerifiedIcon from "@mui/icons-material/Verified";
import { GenericDevice } from "../graphql/generated";

type Props = {
  device: IDevice;
  addToList: (device: IDevice) => void;
};

const UserQuerry = `
  query($email: String!) {
  User(email: $email) {

      isVerified

      }
  }
  `;

export function GenericDeviceDisplay({ device, addToList }: Props) {
  const email = device.userEmail;

  const [userInDb] = useQuery({
    query: UserQuerry,
    variables: { email },
  });

  if (userInDb.fetching) return <CircularProgress />;
  return (
    <ListItemButton>
      {device.id} - {device.name} {device.powerLoss}{" "}
      {userInDb.data.User.isVerified && <VerifiedIcon />}
      <Button onClick={() => addToList(device)}>Add</Button>
    </ListItemButton>
  );
}
