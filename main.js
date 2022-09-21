require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Bot ready (${client.user.tag})`);
})

client.on("messageCreate", (message) => {
    const msg = message.content.toLowerCase();
    console.debug(msg);

    if (msg == "hello") {
        message.channel.send("world");
    };
});

client.login(process.env.TOKEN);
