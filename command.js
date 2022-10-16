const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const fs = require('fs');

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


rest.put(Routes.applicationGuildCommands('938944339072126997', '935364498125095002'), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

