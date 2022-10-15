const discord = require("discord.js");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require('fs');
const app = express();
const { Client, GatewayIntentBits, EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const command = require('./command.js');
const { REST, SlashCommandBuilder, Routes } = require('discord.js');


app.set('view engine', 'ejs');
app.use(express.static("./public/static"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
	extended: true,
  }),
);



client.once('ready', () => {
    console.log(`${client.user.username} is online!`)
})

client.on("guildCreate", guild => {
    const commands = [
		new SlashCommandBuilder().setName('verify').setDescription('Sends you a verification link.'),
		new SlashCommandBuilder().setName('help').setDescription('Replies with Commands.'),
		new SlashCommandBuilder().setName('setrole').setDescription('Set verification role.'),
	]
		.map(command => command.toJSON());
	
	const rest = new REST({ version: '10' }).setToken("MTAwNTE0MjQ0OTgxMjk0Njk1NA.G9RlzE.0PoCeHwz4HLl9jjlKNCzJy4AscY6uHYVlUOnpU");
	
	
	rest.put(Routes.applicationGuildCommands('1005142449812946954', guild.id.toString()), { body: commands })
		.catch(console.error);
})



app.get('/', (req,res) => {
	res.send("test")
})


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const filter = i => i.customId === 'success' && i.user.id === interaction.user.id;

	const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
	
	collector.on('collect', async i => {
		let Embed22 = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Verification")
		.setDescription('Link: ' + `[Click to verify](https://wever-verification.herokuapp.com/user/${interaction.user.id})`);

		if (interaction.member.roles.cache.some(role => role.name === 'verified')) {
			await i.reply({ content: "You are already Verified.", ephemeral: true }).catch(error => { return; });
		} else {
			client.users.send(interaction.user.id, { embeds: [Embed22] }).catch(error => { return; });
		    i.reply({ content: "Please check your DM's.", ephemeral: true }).catch(error => { return; });
		}
	});

	app.get(`/user/${interaction.user.id}`, (req,res) => {

		let role = interaction.member.guild.roles.cache.find(role => role.name === "verified");
		interaction.guild.members.cache.get(interaction.user.id).roles.add(role).catch(error => { return; });

		let Embed32 = new EmbedBuilder()
		.setColor("Green")
		.setTitle("Verified")
		.setDescription("You have been verified!")
		.addFields(
			{ name: 'Status', value: 'Verified', inline: true },
			{ name: 'Role', value: ` ${role.name}`, inline: true },
		);

	/*	if (interaction.member.roles.cache.find(r => r.name === "verified")) {
		} else {
			client.users.send(interaction.user.id, { embeds: [Embed32] }).catch(error => { return; });
		}
*/

		res.render("index.ejs", { id: interaction.user.id, role: role.name, tag: interaction.user.tag })
	});

	const { commandName } = interaction;

	if (commandName === 'verify') {

		let Embed2 = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Verification")
		.setDescription('Link: ' + `[Click to verify](https://wever-verification.herokuapp.com/user/${interaction.user.id})`);

		if (interaction.member.guild.roles.cache.find(role => role.name === "verified")) {
		} else {
			guild.roles.create({ name: "verified", reason: "Creating new role" })
		}

		if (interaction.member.roles.cache.some(role => role.name === 'verified')) {
			await interaction.reply({ content: "You are already Verified.", ephemeral: true }).catch(error => { return; });
		} else {
			client.users.send(interaction.user.id, { embeds: [Embed2] }).catch(error => { return; });
		    interaction.reply({ content: "Please check your DM's.", ephemeral: true }).catch(error => { return; });
		}


	} else if (commandName === 'help') {
		let helpEmb = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Help")
		.setDescription("More commands coming soon!")
		.addFields(
			{ name: 'Verify', value: 'Verify users.', inline: true },
			{ name: 'Panel', value: "Creates Verification panel.", inline: true },
		);
	
		interaction.reply({ embeds: [helpEmb] });
	} else if (commandName === 'panel') {
		if (interaction.options.getSubcommand() === 'channel') {
				try {
					let channel = interaction.options.getChannel('target');
					if(channel.id) {
						const exampleEmbed = new EmbedBuilder()
						.setColor("Green")
						.setTitle("Verification")
						.setDescription("Click the button below to Verify.");

						const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId('success')
								.setLabel('Verify')
								.setStyle(ButtonStyle.Success),
						);
						
						let channel2 = client.channels.cache.get(channel.id);
						channel2.send({ embeds: [exampleEmbed], components: [row] });
					}
				} catch(e) {
					return;
				}
			}
	}


});

client.login("MTAwNTE0MjQ0OTgxMjk0Njk1NA.G9RlzE.0PoCeHwz4HLl9jjlKNCzJy4AscY6uHYVlUOnpU");
app.listen(process.env.PORT, function() {
	console.log("Website Online!")
});