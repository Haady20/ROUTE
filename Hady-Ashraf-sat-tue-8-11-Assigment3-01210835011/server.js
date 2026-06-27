const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const usersFile = path.join(__dirname, "users.json");

async function readUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(usersFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

function send(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    // 1
    if (req.method === "POST" && url.pathname === "/user") {
      const body = await getBody(req);
      const users = await readUsers();

      if (!body.name || body.age === undefined || !body.email) {
        return send(res, 400, {
          message: "Name, age and email are required."
        });
      }

      if (users.some(user => user.email === body.email)) {
        return send(res, 409, {
          message: "Email already exists."
        });
      }

      const id = users.length
        ? Math.max(...users.map(user => user.id)) + 1
        : 1;

      users.push({
        id,
        name: body.name,
        age: body.age,
        email: body.email
      });

      await writeUsers(users);

      return send(res, 201, {
        message: "User added successfully."
      });
    }

    // 2
    if (
      req.method === "PATCH" &&
      parts[0] === "user" &&
      parts.length === 2
    ) {
      const id = Number(parts[1]);
      const body = await getBody(req);
      const users = await readUsers();
      const index = users.findIndex(user => user.id === id);

      if (index === -1) {
        return send(res, 404, {
          message: "User ID not found."
        });
      }

      const fields = ["name", "age", "email"].filter(
        field => body[field] !== undefined
      );

      if (!fields.length) {
        return send(res, 400, {
          message: "No valid fields to update."
        });
      }

      if (
        body.email &&
        users.some(user => user.email === body.email && user.id !== id)
      ) {
        return send(res, 409, {
          message: "Email already exists."
        });
      }

      fields.forEach(field => {
        users[index][field] = body[field];
      });

      await writeUsers(users);

      const message = fields.length === 1
        ? `User ${fields[0]} updated successfully.`
        : "User updated successfully.";

      return send(res, 200, { message });
    }

    // 3
    if (
      req.method === "DELETE" &&
      parts[0] === "user" &&
      parts.length === 2
    ) {
      const id = Number(parts[1]);
      const users = await readUsers();
      const index = users.findIndex(user => user.id === id);

      if (index === -1) {
        return send(res, 404, {
          message: "User ID not found."
        });
      }

      users.splice(index, 1);
      await writeUsers(users);

      return send(res, 200, {
        message: "User deleted successfully."
      });
    }

    // 4
    if (req.method === "GET" && url.pathname === "/user") {
      const users = await readUsers();
      return send(res, 200, users);
    }

    // 5
    if (
      req.method === "GET" &&
      parts[0] === "user" &&
      parts.length === 2
    ) {
      const id = Number(parts[1]);
      const users = await readUsers();
      const user = users.find(user => user.id === id);

      if (!user) {
        return send(res, 404, {
          message: "User not found."
        });
      }

      return send(res, 200, user);
    }

    return send(res, 404, {
      message: "Route not found."
    });
  } catch (error) {
    const statusCode = error.message === "Invalid JSON" ? 400 : 500;

    return send(res, statusCode, {
      message: error.message
    });
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
