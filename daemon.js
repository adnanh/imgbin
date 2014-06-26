var daemon = require("daemonize2").setup({
    main: "application.js",
    name: "imgbin",
    pidfile: "imgbin.pid",
    cwd: '.'
});

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");
}
