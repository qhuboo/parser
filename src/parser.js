class Parser {
  constructor(argv) {
    this.commands = {};
    this.globalOptions = {};
    this.argv = argv;
  }

  command(cmd, description, builder, handler) {
    const commandConfig = {
      cmd,
      description,
      options: {},
      positionals: {},
      handler,
    };
    this.commands[cmd] = commandConfig;

    const yargs = {
      option: (key, config) => {
        this.option(key, config, cmd);
        return yargs;
      },
      positional: (key, config) => {
        this.positional(key, config, cmd);
        return yargs;
      },
    };

    builder(yargs);

    return this;
  }

  option(key, config, commandName) {
    if (commandName) {
      this.commands[commandName].options[key] = config;
    } else {
      this.globalOptions[key] = config;
    }
    return this;
  }

  positional(key, config, commandName) {
    if (commandName) {
      this.commands[commandName].positionals[key] = config;
    }
    return this;
  }

  parse() {
    console.log(this.commands.new);
  }
}

const parser = new Parser();
parser
  .command(
    "new",
    "Create a new note",
    (yargs) => {
      yargs
        .option("color", {
          description: "Color of the note",
          type: "string",
          default: "yellow",
        })
        .positional("note", {
          description: "Content of the note",
          required: true,
        });
    },
    (argv) => {
      console.log(
        `New note added with content: ${argv.note} and color: ${argv.color}`
      );
    }
  )
  .parse();
