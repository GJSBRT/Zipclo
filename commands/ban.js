const userReg = RegExp(/<@!?(\d+)>/)

module.export = {
    name: 'ban',
    description: 'Bans a member from the server.',
    usage: '<member> [reason]',
    async execute (message, args) {//
        const userID = userReg.test(args[0]) ? userReg.exec(args[0])[1] : args[0]
        const mentionedUser = await message.client.users.fetch(userID).catch(() => null)

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('You don\'t have permission to ban members.')
        }
        else if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('I don\'t have permissions to ban members.')
        }
        else if (!mentionedUser) {
            return message.channel.send('You need to mention a member to ban.')
        }

        const allBans = await message.guild.fetchBans()

        if (allBans.get (mentionedUser.id)) {
            return message.channel.send('This member is already banned.')
        }

        const mentionedMember = message.guild.members.cache.get(mentionedUser.id)

        if (mentionedUser) {
            const mentionedPosition = mentionedMember.roles.highest.position
            const memberPosition = message.member.roles.highest.position
            const botPosition = message.guild.me.roles.highest.position

            if (memberPosition <= mentionedPosition) {
                return message.channel.send('You can\'t ban this member because their roles are higher/equal to yours.')
            }
            else if (botPosition <= mentionedPosition) {
                return message.channel.send('I can\'t ban this member because their roles are higher/equal to mine.')
            }
        }

        const reason = args.slice(1).join(' ')
        
        message.guild.members.ban(mentionedUser.id, { reason: reason})

        message.channel.send(`Banned ${mentionedUser} ${reason ? `for **${reason}**` : ''}`)
    }
}