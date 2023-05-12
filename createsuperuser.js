const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const fs = require("fs");
const { exit } = require("process");
const yargs = require("yargs");
const { hash } = require("argon2");

function validateCredentials({ username, password }) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (username.length < 5) {
    console.log("Username must be 8 characters or longer");
    return false;
  }
  if (!passwordRegex.test(password)) {
    console.log(
      "Must contain at least 1: LOWERCASE, UPPERCASE, NUMERIC and SPECIAL character"
    );
    return false;
  }
  return true;
}

async function createSuperUser({ username, password }) {
  if (!validateCredentials({ username, password })) exit(1);

  const prisma = new PrismaClient();
  try {
    await prisma.user.create({
      data: {
        username,
        password: await hash(password),
      },
    });
    console.log("User created successfully!");
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.error("The user already exists");
        exit(1);
      }
    } else {
      console.log(e);
    }
  }
}

function dbFileCheck() {
  if (!fs.existsSync("./prisma/sqlite.db")) {
    console.log("Database is not found. Create one!");
    exit(1);
  }
}

function main() {
  dbFileCheck();

  const options = yargs
    .usage("Usage: --username <name> --password <password>")
    .option("username", {
      alias: "username",
      describe: "Your Username",
      type: "string",
      demandOption: true,
    })
    .option("password", {
      alias: "password",
      describe: "Your Password",
      type: "string",
      demandOption: true,
    })
    .parse();

  createSuperUser(options);
}

main();
