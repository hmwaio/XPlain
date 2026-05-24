import { prisma } from "../../lib/prisma.lib.js";
import type { SignInInput } from "../../types/type.js";
import { signToken } from "../../utils/jwt.js";
import { verifyPassword } from "../../utils/passwords.js";

/* SignIn */
export const signinUser = async (data: SignInInput) => {
  /* Check user exist in db or not */
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!existingUser) {
    throw new Error("Invalid credintials");
  }
  if (!existingUser.is_verified) {
    throw new Error("Please complete registration first");
  }

  /* Check password is valid or invalid */
  const isPasswordValid = await verifyPassword(
    data.password,
    existingUser.password,
  );
  if (!isPasswordValid) {
    throw new Error("Invalid credintials");
  }

  /* Generate Token */
  const token = signToken({
    user_id: existingUser.user_id,
    email: existingUser.email,
    name: existingUser.name,
  });
  return { user: existingUser, token };
};
