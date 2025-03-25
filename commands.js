const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const SlashCommandBuilder = require('discord.js');
dotenv.config();
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)


const commands = [
  new SlashCommandBuilder()
    .setName('ping12')
    .setDescription('Replies with Pong!')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('channel')
    .setDescription('My YouTube Channel')
    .toJSON()
];

async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands('1346899706265079899', '1347328103298498570'), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

// Call the async function
registerCommands();

module.exports = registerCommands
