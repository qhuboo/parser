import Parser from "./parser.js";

const argv = new Parser()
  .command(
    "greet",
    "Greet a user",
    (yargs) => {
      yargs.option("name", {
        type: "string",
        describe: "Name of the person to greet",
      });
    },
    (args) => {
      console.log(`Hello, ${args.name}!`);
    }
  )
  .option("verbose", {
    type: "boolean",
    describe: "Enable verbose mode",
  })
  .help()
  .parse(["greet", "Alice"]);

console.log(argv);
