const { execute } = require("./ping");

module.exports = {
    name: 'kick',
    description: 'Kicks a member from this guild.',
    usage: '<@member> [reason]',
    async execute (message, args) {
        const mentionedMember = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])

        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.channel.send('You don\'t have permission to kick guild members.')
        }
        else if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
            return message.channel.send('I don\'t have permission to kick guild members.')
        }
        else if (!mentionedMember) {
            return message.channel.send('You need to mention the guild member you want to kick.')
        }

        const mentionedPosition = mentionedMember.roles.highest.position
        const memberPosition = message.member.roles.highest.position
        const botPosition = message.guild.me.roles.highest.position

        if (memberPosition <= mentionedPosition) {
            return message.channel.send('You can\'t kick this member because their role is higher/equal to yours.')
        }
        else if (botPosition <= mentionedPosition) {
            return message.channel.send('I can\'t kick this member because their role is higer/equal to mine.')
        }

        const reason = args.slice(1).join(' ')
        
        try {
            await mentionedMember.kick([reason])

            message.channel.send(`Kicked ${mentionedMember} ${reason ? `for **${reason}**` : ''}`)
        }
        catch (error) {
            console.log(error)
            message.channel.send('There was an error kicking this member.')
        }
    }
}