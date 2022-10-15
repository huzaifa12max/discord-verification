const { REST, SlashCommandBuilder, Routes } = require('discord.js');

const commands = [
	new SlashCommandBuilder().setName('verify').setDescription('Sends you a verification link.'),
	new SlashCommandBuilder().setName('help').setDescription('Replies with Commands.'),
	new SlashCommandBuilder().setName('setrole').setDescription('Set verification role.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken("MTAwNTE0MjQ0OTgxMjk0Njk1NA.G9RlzE.0PoCeHwz4HLl9jjlKNCzJy4AscY6uHYVlUOnpU");

rest.put(Routes.applicationGuildCommands('1005142449812946954', '935364498125095002'), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);