const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("outro")
		.setDescription("Plays outro!"),
	async execute(interaction) {
		await interaction.reply("Playing outro!");

		const connection = joinVoiceChannel({
			channelId: "1022019781265735684",
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const player = createAudioPlayer();
		const resource = createAudioResource(path.resolve("./audio/xenogenesis.mp3"));

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Playing, () => {
			console.log("Playing audio...");
		});
	},
};