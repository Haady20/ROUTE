const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const usersFile = path.join(__dirname, "users.json");

app.use(express.json());

async function readUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(usersFile, "[]");
      return [];
    }

    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(
    usersFile,
    JSON.stringify(users, null, 2)
  );
}

function asyncHandler(fn) {
  return (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

//1
app.post("/user", asyncHandler(async (req, res) => {
  const { name, age, email } = req.body;
  const users = await readUsers();

  if (!name || age === undefined || !email) {
    return res.status(400).json({
      message: "Name age and email are required."
    });
  }

  if (users.some(user => user.email === email)) {
    return res.status(409).json({
      message: "Email already exists."
    });
  }

  const id = users.length
    ? Math.max(...users.map(user => user.id)) + 1
    : 1;

  users.push({
    id,
    name,
    age,
    email
  });

  await writeUsers(users);

  return res.status(201).json({
    message: "User added successfully."
  });
}));

//2
app.patch("/user/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const users = await readUsers();

  const index = users.findIndex(user => user.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "User ID not found."
    });
  }

  const fields = ["name", "age", "email"].filter(
    field => req.body[field] !== undefined
  );

  if (!fields.length) {
    return res.status(400).json({
      message: "No valid fields to update."
    });
  }

  if (
    req.body.email &&
    users.some(
      user =>
        user.email === req.body.email &&
        user.id !== id
    )
  ) {
    return res.status(409).json({
      message: "Email already exists."
    });
  }

  fields.forEach(field => {
    users[index][field] = req.body[field];
  });

  await writeUsers(users);

  const message = fields.length === 1
    ? `User ${fields[0]} updated successfully.`
    : "User updated successfully.";

  return res.json({ message });
}));

//3
app.delete(
  ["/user", "/user/:id"],
  asyncHandler(async (req, res) => {
    const id = Number(
      req.params.id ?? req.body?.id
    );

    const users = await readUsers();

    const index = users.findIndex(
      user => user.id === id
    );

    if (!id || index === -1) {
      return res.status(404).json({
        message: "User ID not found."
      });
    }

    users.splice(index, 1);
    await writeUsers(users);

    return res.json({
      message: "User deleted successfully."
    });
  })
);

//4
app.get(
  "/user/getByName",
  asyncHandler(async (req, res) => {
    const name = String(
      req.query.name || ""
    ).toLowerCase();

    const users = await readUsers();

    const user = users.find(
      user => user.name.toLowerCase() === name
    );

    if (!user) {
      return res.status(404).json({
        message: "User name not found."
      });
    }

    return res.json(user);
  })
);

//5
app.get("/user", asyncHandler(async (req, res) => {
  const users = await readUsers();
  return res.json(users);
}));

//6
app.get(
  "/user/filter",
  asyncHandler(async (req, res) => {
    const minAge = Number(req.query.minAge);

    if (Number.isNaN(minAge)) {
      return res.status(400).json({
        message: "minAge is required."
      });
    }

    const users = await readUsers();

    const filteredUsers = users.filter(
      user => user.age >= minAge
    );

    if (!filteredUsers.length) {
      return res.status(404).json({
        message: "no user found"
      });
    }

    return res.json(filteredUsers);
  })
);

//7
app.get(
  "/user/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const users = await readUsers();

    const user = users.find(
      user => user.id === id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.json(user);
  })
);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});