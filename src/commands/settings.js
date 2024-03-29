// Libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// Assets
const teamColors = require(`../assets/teams/colors.json`);

// Methods
const query = require(`../methods/database/query.js`);
const formatTeam = require(`../methods/format-team.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`settings`)
		.setDescription(`NBABot settings`)
        .addSubcommand(subcommand => 
            subcommand
                .setName(`favourite-team`)
                .setDescription(`Change your favourite team.`)
                .addStringOption(option => option.setName(`team`).setDescription(`An NBA team, e.g. PHX or Lakers.`).setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName(`odds`)
                .setDescription(`Change whether you want odds as decimal or as a US moneyline.`)
                .addStringOption(option => option.setName(`type`).setDescription(`Either decimal or US.`).addChoices({
                    name: `Decimal`,
                    value: `decimal`
                }).addChoices({
                    name: `US`,
                    value: `us`
                }).setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName(`date-format`)
                .setDescription(`Change whether the date format is mm/dd/yyyy (US) or dd/mm/yyyy (International).`)
                .addStringOption(option => option.setName(`format`).setDescription(`Either US (mm/dd/yyyy) or International (dd/mm/yyyy).`).addChoices({
                    name: `US (mm/dd/yyyy)`,
                    value: `us`
                }).addChoices({
                    name: `International (dd/mm/yyyy)`,
                    value: `international`
                }).setRequired(true))),
    
	async execute(variables) {
		let { con, interaction } = variables;

		let subcmd = interaction.options.getSubcommand(); let embed;

        switch (subcmd) {
            case `favourite-team`:
                let team = interaction.options.getString(`team`);
                team = formatTeam(team);
                if (!team) return await interaction.reply(`Please specify a valid team. See all available teams with \`/teams\`.`);

                await query(con, `UPDATE users SET FavouriteTeam = '${team}' WHERE ID = '${interaction.user.id}';`);

                embed = new Discord.MessageEmbed()
                    .setColor(teamColors.NBA)
                    .addField(`Success! Changed your favourite team to \`${team}\`.`, `Use \`/balance\` to see this change.`);

                return await interaction.reply({ embeds: [embed] });
                break;

            case `odds`:
                let type = interaction.options.getString(`type`);
                await query(con, `UPDATE users SET Odds = '${type[0].toLowerCase()}' WHERE ID = '${interaction.user.id}';`);

                embed = new Discord.MessageEmbed()
                    .setColor(teamColors.NBA)
                    .addField(`Success! Changed your odds type to \`${type}\`.`, `Use \`/odds\` to see odds for upcoming games.`);
                
                return await interaction.reply({ embeds: [embed] });
                break;

            case `date-format`:
                let format = interaction.options.getString(`format`);
                await query(con, `UPDATE users SET DateFormat = '${format[0].toLowerCase()}' WHERE ID = '${interaction.user.id}';`);

                embed = new Discord.MessageEmbed()
                    .setColor(teamColors.NBA)
                    .addField(`Success! Changed your date format to \`${format}\`.`, `Use commands with dates to try this out.`);

                return await interaction.reply({ embeds: [embed] });
                break;

            default:
                return await interaction.reply(`Please select a valid setting`);
                break;
        }
	},
};
