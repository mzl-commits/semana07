const allAccess = (_req, res) => res.status(200).send("Public Content.");
const userBoard = (_req, res) => res.status(200).send("User Content.");
const adminBoard = (_req, res) => res.status(200).send("Admin Content.");
const moderatorBoard = (_req, res) => res.status(200).send("Moderator Content.");

export default { allAccess, userBoard, adminBoard, moderatorBoard };
