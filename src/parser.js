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

    // Create scoped context to pass into the builder function
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
    let [cmd, ...args] = process.argv.slice(2);

    // Extracting all the possible options
    const possibleOptions = [];
    args.forEach((arg) => {
      if (arg.match(/--?[\w-]+/g)) {
        possibleOptions.push(arg.replace("-", "").replace("-", ""));
      }
    });
    // console.log(possibleOptions);

    const options = {};
    const positional = {};
    for (const command in this.commands) {
      // Check whether the command is valid, throw error if not
      if (cmd === command.split(" ")[0]) {
        cmd = this.commands[command].handler;

        // Get all the valid options for the current command
        const commandOptions = Object.keys(this.commands[command].options);
        possibleOptions.forEach((possibleOption) => {
          commandOptions.forEach((option) => {
            if (
              possibleOption === option ||
              possibleOption === this.commands[command].options[option].alias
            ) {
              const alias = this.commands[command].options[option].alias;
              const validOption = { [option]: true, [alias]: true };

              if (
                !options.hasOwnProperty([option]) &&
                !options.hasOwnProperty([alias])
              ) {
                options[option] = true;
                options[alias] = true;
              }
            }
          });
        });
      } else {
        throw Error(`Invalid Command: ${cmd}`);
      }

      // Extract all the required positional arguments (denoted with <>) from the command name
      // and add add them to the positional object as the key and the content of args as the value
      // in order. (e.g. If the command name contains two required positional arguments <source> and <destination>
      // then the positional array will contain two items, source: args[0] and destination: args[1])
      const matches = [...command.matchAll(/<([^>]+)>/g)].map(
        (match) => match[1]
      );
      matches.forEach((match, index) => (positional[match] = args[index]));
    }

    this.argv = { ...options, ...positional };
    cmd(this.argv);
  }
}

const parser = new Parser(process.argv);
parser
  .command(
    "cp <source> <destination> [options]",
    "Copy a file",
    (yargs) => {
      yargs
        .option("r", {
          alias: "recursive",
          description: "Recursively copy files, copy a directory",
          type: "string",
        })
        .positional("source", {
          description: "Source path",
          required: true,
        })
        .positional("destination", {
          description: "Destination path",
          required: true,
        });
    },
    (argv) => {
      console.log(argv);
    }
  )
  .parse();
