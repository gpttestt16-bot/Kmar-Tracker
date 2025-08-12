const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

let trackedRoleId = null;

const commands = [
  new SlashCommandBuilder()
    .setName('rol-toevoegen')
    .setDescription('Stel de rol in die getrackt wordt')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('De rol die je wilt tracken')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('rol-verwijderen')
    .setDescription('Verwijder de getrackte rol')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Slash commands registreren...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log(' Slash commands geregistreerd!');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(` Ingelogd als ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'Koninklijke Marechaussee', type: 3 }],
    status: 'online'
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rol-toevoegen') {
    const role = interaction.options.getRole('rol');
    trackedRoleId = role.id;
    await interaction.reply(`Rol **${role.name}** wordt nu succesvol getrackt.`);
  }

  if (interaction.commandName === 'rol-verwijderen') {
    trackedRoleId = null;
    await interaction.reply(`De getrackte rol is succesvol verwijderd.`);
  }
});

client.login(process.env.TOKEN);
