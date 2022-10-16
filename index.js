const discord = require("discord.js");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require('fs');
const app = express();
const { Client, GatewayIntentBits, EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField   } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const command = require('./command.js');
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const mongoose = require("mongoose");
const Database = 'mongodb+srv://huzaifa:siddique@cluster0.socueya.mongodb.net/?retryWrites=true&w=majority';
const Datastore = require("./Scheme/Datastore.js");
const { findOneAndReplace } = require("./Scheme/Datastore.js");

app.set('view engine', 'ejs');
app.use(express.static("./public/static"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
	extended: true,
  }),
);

if(!Database) return;
mongoose.connect(Database, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('The Database has connected!')
}).catch((err) => {
	console.log(err)
});


client.once('ready', () => {
    console.log(`${client.user.username} is online!`)
})


client.on("guildCreate", guild => {
	const commands = [
		new SlashCommandBuilder().setName('verify').setDescription('Sends you a verification link.'),
		new SlashCommandBuilder().setName('help').setDescription('Replies with Commands.'),
		new SlashCommandBuilder().setName('panel').setDescription('Set verification panel.').addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('The channel name')
				.addChannelOption(option => option.setName('target').setDescription('The channel'))),
		new SlashCommandBuilder().setName('logs').setDescription('Sets logging channel').addSubcommand(subcommand =>
		subcommand
			.setName('channel')
			.setDescription('The channel name')
			.addChannelOption(option => option.setName('target').setDescription('The channel'))),
	]
		.map(command => command.toJSON());

	const rest = new REST({ version: '10' }).setToken("OTM4OTQ0MzM5MDcyMTI2OTk3.GDzXU8.DAFm4OesPQYuSyU4p3m8a9PYT6mDkgvO78SWH4");


	rest.put(Routes.applicationGuildCommands('938944339072126997', guild.id.toString()), { body: commands })
		.catch(console.error);
});



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

		if (interaction.member.guild.roles.cache.find(role => role.name === "verified")) {
		} else {
			interaction.guild.roles.create({ name: "verified", reason: "Creating new role" })
		}

		if (interaction.member.roles.cache.some(role => role.name === 'verified')) {
			await i.reply({ content: "You are already Verified.", ephemeral: true }).catch(error => { return; });
		} else {
			client.users.send(interaction.user.id, { embeds: [Embed22] }).catch(error => { return; });
		    i.reply({ content: "Please check your DM's.", ephemeral: true }).catch(error => { return; });
		}
	});

	app.get(`/user/${interaction.user.id}`, (req,res) => {

		let role = interaction.member.guild.roles.cache.find(role => role.name === "verified");

			interaction.guild.members.cache.get(interaction.user.id).roles.add(role).catch(error => { console.log(error) });

			if (interaction.member.roles.cache.some(role => role.name === 'verified')) {
				console.log("User verified")
			} else {
				console.log("user not verified")
			}
		});

			/*Datastore.findOne({ guild_id: interaction.guild.id }, function (err,docs) {
				if (err) {
					return;
				} else if(docs) {
					let embe = new EmbedBuilder()
					.setColor("Blue")
					.setTitle("Verified")
					.setDescription(`<@${interaction.user.id}> has been Verified. More info: [Link](https://wever-verification.herokuapp.com/user/${interaction.user.id})`)

					const channel = client.channels.cache.get(docs.channel_id.toString());
					channel.send({ embeds: [embe] });
				}
			})*/

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
			interaction.guild.roles.create({ name: "verified", reason: "Creating new role" })
		}

		if (interaction.member.roles.cache.some(role => role.name === 'verified')) {
			interaction.reply({ content: "You are already Verified.", ephemeral: true }).catch(error => { return; });
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
			{ name: 'Logs', value: "Sets the logs channel.", inline: true },
		);
	
		interaction.reply({ embeds: [helpEmb] });
	} else if (commandName === 'panel') {
		if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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
		} else {
			interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true }).catch(error => { return; })
		}
	} else if (commandName === "logs") {
		if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			if (interaction.options.getSubcommand() === 'channel') {
				try {
					let channel = interaction.options.getChannel('target');
						var log_channel = new Datastore({
							guild_id: interaction.guild.id,
							channel_id: channel.id
						});

						Datastore.findOne({ guild_id: interaction.guild.id }, function(err, docs) {
							if (docs) {
								Datastore.findOneAndUpdate({ guild_id: interaction.guild.id },
									{channel_id: channel.id}, null, function (err, docs) {
									if (err){
										console.log(err)
									}
									else{
										interaction.reply({ content: `Log channel updated to <#${channel.id}>.`, ephemeral: true })
									}
								});
							} else if(err) {
								console.log(err)
							} else {
								log_channel.save();
								interaction.reply({ content: `Log channel set to <#${channel.id}>.`, ephemeral: true })
							}
						})

						/*if(Datastore.findOne({ guild_id: interaction.guild.id })) {
							interaction.reply({ content: `Log channel updated to <#${channel.id}>.`, ephemeral: true })
						} else {
							log_channel.save();
							interaction.reply({ content: `Log channel set to <#${channel.id}>.`, ephemeral: true })
						} */


				} catch(e) {
					return;
				}
			}
	} else {
		interaction.reply({ content: "You do not have permission to use this command!", ephemeral: true }).catch(error => { return; })
	}
}


});



client.login("OTM4OTQ0MzM5MDcyMTI2OTk3.GDzXU8.DAFm4OesPQYuSyU4p3m8a9PYT6mDkgvO78SWH4");
app.listen(process.env.PORT, function() {
	console.log("Website Online!")
});