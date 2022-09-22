const path = require("node:path");
const { SlashCommandBuilder, Collection } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require("@discordjs/voice");

const delay = 15000;
let states = new Collection();
let outroCount = 0;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("outro")
		.setDescription("Plays outro!"),
	async execute(interaction) {
		const guild = interaction.guild;
		const member = interaction.member;
		const channelId = member.voice.channelId;
		let state = states.get(guild);
		if (!states.get(guild)) {
			const _state = {
				playing: false,
				user: null
			};
			states.set(guild, _state);
			state = _state;
		}

		if (state?.user == member) {
			interaction.reply({
				content: "You're already playing an outro!",
				ephemeral: true
			});
			return;
		}
		if (!channelId) {
			interaction.reply({
				content: "You must be in a voice channel to play an outro!",
				ephemeral: true
			});
			return;
		};
		if (state?.playing) {
			setTimeout(() => {
				// Will be a little early because of audio play delay (or a little late because of reply time)
				interaction.followUp({
					content: "You can now start your outro!",
					ephemeral: true
				});
			}, delay);
			interaction.reply({
				content: "An outro is already playing!",
				ephemeral: true
			});
			return;
		}

		interaction.reply("Playing outro!");
		states.set(guild, {
			playing: true,
			user: member
		});
		outroCount++;
		updateActivity(interaction.client);

		const connection = joinVoiceChannel({
			channelId: channelId,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
		});
		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play
			}
		});
		const resource = createAudioResource(path.resolve("./audio/xenogenesis.mp3"));

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Playing, () => {
			console.debug("Audio player is playing audio");
			setTimeout(async () => {
				await interaction.member.voice.disconnect();
				interaction.followUp({
					content: "Your outro finished!",
					ephemeral: true
				});
				states.set(guild, {
					playing: false,
					user: null
				});
				outroCount--;
				updateActivity(interaction.client);

				console.debug("Kicked user");
			}, delay);
		});

		player.on(AudioPlayerStatus.Paused, () => {
			console.debug("Paused...");
		});

		player.on(AudioPlayerStatus.Idle, () => {
			console.debug("Audio player is now idle");
			setTimeout(() => {
				if (player.state.status === "idle") {
					console.debug("Disconnecting from voice channel");
					connection.destroy();
				}
			}, 30000);
		});
	},
};

function updateActivity(client) {
	client.user.setActivity(`${outroCount} outro${outroCount === 1 ? "" : "s"}!`);
}