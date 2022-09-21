const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("outro")
		.setDescription("Plays outro!"),
	async execute(interaction) {
		await interaction.reply("Playing outro!");
	},
};