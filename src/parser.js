class Parser {
  constructor(argv) {
    this.commands = {};
    this.globalOptions = {};
    this.argv = argv;
  }

  command(cmd, desc, builder, handler) {
    this.commands[cmd] = {
      desc,
      builder,
      handler,
    };
    builder(this);
    return this;
  }

  options() {
    console.log("This is the options method");
    return this;
  }

  positional() {
    return this;
  }

  parse() {
    const [cmd, ...args] = this.argv.slice(2);
    console.log(cmd);
    console.log(args);
  }

  help() {
    console.log("This is the help method");
  }
}

const parser1 = new Parser(process.argv);
parser1
  .command(
    "new <note>",
    "adds a new note",
    (yargs) => console.log(yargs),
    () => {
      console.log("this is the handler");
    }
  )
  .positional()
  .parse();
