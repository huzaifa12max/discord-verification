const discord = require("discord.js");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { Client, GatewayIntentBits, EmbedBuilder  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const command = require('./command.js');

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

app.get('/', (req,res) => {
	res.send("test")
})


client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

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
		.setDescription('link: ' + 'http://localhost:8080/user/' + interaction.user.id);

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


	}
});

client.login("MTAwNTE0MjQ0OTgxMjk0Njk1NA.G9RlzE.0PoCeHwz4HLl9jjlKNCzJy4AscY6uHYVlUOnpU");
app.listen('8080' || process.env.PORT, function() {
	console.log("Website Online!")
});