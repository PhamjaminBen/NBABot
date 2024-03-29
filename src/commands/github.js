// Libraries
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// Assets
const teamColors = require(`../assets/teams/colors.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`github`)
		.setDescription(`Gives you the link for NBABot's GitHub`),
    
	async execute(variables) {
		let { interaction } = variables;

        let embed = new Discord.MessageEmbed()
            .addField(`NBABot's GitHub:`, `[https://github.com/EliotChignell/NBABot](https://github.com/EliotChignell/NBABot)`)
            .setColor(teamColors.NBA);

        return await interaction.reply({ embeds: [embed] });
	},
};
