import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  // Authenticated check
  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  // change password logic
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const usersCollection = client.db();
  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    client.close();
    res.status(402).json({ message: "User not found!" });
    return;
  }

  const currentPassword = user.newPassword;
  const isEqualPassword = verifyPassword(currentPassword, oldPassword);

  if (!isEqualPassword) {
    client.close();
    res.status(403).json({ message: "Old password is not correct!" });
    return;
  }

  const hashedPassword = hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
