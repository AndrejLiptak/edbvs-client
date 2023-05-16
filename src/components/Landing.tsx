import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { ProfilePage } from "./Profile";
import { NewUser } from "./NewUser";
import { useUserVerifyQuerryQuery } from "../graphql/generated";

export function Landing() {
  const { user } = useAuth0();

  const email1 = user?.email;
  const name = user?.name;

  const email: string = email1!;

  const [userInDb] = useUserVerifyQuerryQuery({ variables: { email } });

  if (userInDb.fetching) return <CircularProgress />;

  if (userInDb.data && userInDb.data.User == null) {
    return <NewUser email={email} name={name} />;
  }

  return <ProfilePage />;
}
