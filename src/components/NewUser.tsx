import { CircularProgress } from "@mui/material";
import { useMutation, UseQueryState } from "urql";
import { redirect } from "react-router-dom";
import { ProfilePage } from "./Profile";
import { useEffect } from "react";

const PostUser = `
    mutation ($email: String!, $name: String!, $isVerified: Boolean! ) {
        postUser (email: $email, name: $name, isVerified: $isVerified ) {
            name
            email
            isVerified
            } 
        }
    
`;

type Props = {
  email: String | undefined;
  name: String | undefined;
};

export function NewUser({ email, name }: Props) {
  const [postUserResult, postUser] = useMutation(PostUser);

  const variables = { email: email, name: name, isVerified: false };

  useEffect(() => {
    postUser(variables);
  }, []);

  if (postUserResult.fetching) return <CircularProgress />;

  return <ProfilePage />;
}
