import { auth } from "../config/firebase";

export const getCurrentUserUid = () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  return null;
};
