const pino = require("pino");
const transport = pino.transport({
    targets: [
        {
            target: "pino/file",
            options: { destination: "../logs/backend.json", mkdir: true },
        },
        {
            target: "pino-pretty",
            options: {
                colorize: true,
                ignore: "pid,hostname",
            },
        },
    ],
});
const logger = pino(transport);
if (!process.env.WOOZYLOGS) logger.level = "silent";
module.exports = logger;
