class Parser {
  constructor() {
    this.commands = {};
    this.options = {};
    this.globalOptions = {};
  }

  command(cmd, desc, builder, handler) {
    this.commands[cmd] = { desc, builder, handler };
    return this;
  }

  option(key, config) {
    this.globalOptions[key] = config;
    return this;
  }

  help() {
    console.log("Available commands:");
    for (let cmd in this.commands) {
      console.log(`${cmd}: ${this.commands[cmd].desc}`);
    }
    return this;
  }

  parse(argv = process.argv.slice(2)) {
    const [cmd, ...args] = argv;
    if (cmd in this.commands) {
      const command = this.commands[cmd];
      const yargsInstance = {
        option: (optKey, optConfig) => {
          this.options[optKey] = optConfig;
          return yargsInstance;
        },
        positional: (posKey, posConfig) => {
          this.options[posKey] = posConfig;
          return yargsInstance;
        },
      };

      if (command.builder) {
        command.builder(yargsInstance);
      }

      const parsedArgs = args.reduce((acc, arg, index) => {
        const key = Object.keys(this.options)[index];
        acc[key] = arg;
        return acc;
      }, {});

      if (command.handler) {
        command.handler(parsedArgs);
      }
    } else {
      console.log("Command not found.");
    }
  }
}

export default Parser;
