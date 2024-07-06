const { Router } = require("express");
const bcrypt = require("bcryptjs");

const { usersModel } = require("./../schema/user");

const registerRouter = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with username, password, and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               username: johndoe
 *               password: password123
 *               email: johndoe@example.com
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Bad request. Missing username, password, or email.
 *       409:
 *         description: Conflict. Username already exists.
 *       500:
 *         description: Internal server error.
 */
registerRouter.post("/", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) return res.sendStatus(400);
  
  let hashedPassword;

  try { 
    hashedPassword = await bcrypt.hash(password, 10)
  } catch (error) {
    return res.sendStatus(500);
  }

  try {
    const user = new usersModel({username: username, email: email, password: hashedPassword});
    await user.save();
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(409)
  }
})

module.exports = registerRouter;
