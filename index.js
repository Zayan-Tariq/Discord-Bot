const { Client, Events, GatewayIntentBits, Attachment, AttachmentBuilder, Collection } = require('discord.js');
const axios = require('axios');
const schedule = require('node-schedule');
const svgCaptcha = require('svg-captcha');
const dotenv = require('dotenv')
dotenv.config()

const client = new Client({
    intents:
        [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMembers,
        ]
});


client.login(
    process.env.TOKEN
)



const PREFIX = "!"

// Verification handling

client.once('ready', (message) => {
    console.log(`${client.user.tag} is online!`);
})


// client.on('messageCreate', async (message) => {
//     if (message.content !== '!captcha'){
//         // Generate captcha

//         if(message.author.bot) return;
  
//         const captcha = svgCaptcha.create({ noise: 3, color: true  });

//         // converting svg to buffer for discord

//         const buffer = Buffer.from(captcha.data);

//         // Create an attachment

//         const attachment = new AttachmentBuilder(buffer, { name: 'captcha.png'});

//         // send the captcha and store the message

//         await message.channel.send({

//             content: 'Please solve this captcha!',
//             files: [attachment]
//         });
//         // Collect user response

//         const filter = (m) => message.author.id === message.author.id;
//         const collector = message.channel.createMessageCollector({ filter, time: 3000});

//         collector.on('collect', (msg) => {
//             if(msg.author.bot) return;

//             if (msg.content.trim() === captcha.text){
//                 msg.reply(`✅ Verified`);
//                 collector.stop();
//             }
//             else{
//                 msg.reply(`❌ Incorrect! Please attempt again.`)
//             }
//         });

//         collector.on('end', (_, reason) => {
//             if(reason === 'time'){
//                 message.reply('Time\'s Up')
//             };
//         });
//     }
// })









// Message Handling

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

// Commands using the ! Prefix

    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).trim().split(/\s+/);


        if (CMD_NAME === 'info'){

            const commandInfo =  `***Commands and Their Functions:***

            - **Ban** ~ Bans a user. \`!ban [user id]\`
            - **Kick** ~ Kicks a user. \`!kick [user id]\`
            - **Mute** ~ Mutes the user. \`!mute [user id] [duration]\`
            - **Rand** ~ Generates a random number between a given range. \`!rand [starting range] [ending range]\`
            - **Toss** ~ Returns Heads or Tails. \`!toss\`
            - **Dice** ~ Rolls a dice. \`!roll\`
            - **Dumb** ~ Tells you how much you are dumb in %. \`!dumb\`
            
            *More commands to be added in the future*`;
            
            message.reply(commandInfo);
        }

        if (CMD_NAME === 'kick') {
            if (args.length === 0) return message.reply("Please Provide an ID");

            try {
                const member = message.guild.members.fetch(args[0]).then(member => {
                    if (member instanceof require('discord.js').GuildMember) {
                        member.kick()
                            .then(() => message.channel.send(`${member} was kicked!`))
                            .catch(err => {
                                console.error(err);
                                message.reply("I couldn't kick this member. Check my permissions or their role.");
                            });
                    } else {
                        message.reply("That user isn't in the server.");
                    }
                })

            } catch (error) {
                console.error(error);
            }

        }
        if (CMD_NAME === 'ban') {

            if (args.length === 0) return message.reply("Please Provide an ID");

            try {
                const member = message.guild.members.fetch(args[0]).then(member => {
                    if (member instanceof require('discord.js').GuildMember) {
                        member.ban()
                            .then(() => message.channel.send(`${member} was banned!`))
                            .catch(err => {
                                console.error(err);
                                message.reply("I couldn't ban this member. Check my permissions or their role.");
                            });
                    } else {
                        message.reply("That user isn't in the server.");
                    }
                })

            } catch (error) {
                console.error(error);
            }
        }

        if (CMD_NAME === 'unmute') {

            try {
                const member = await message.guild.members.fetch(args[0]);
                const role = await message.guild.roles.fetch('1348372051102273590');
                member.add
                if (!member) {
                    return message.reply("Member not found.");
                }

                if (!role) {
                    return message.reply("Role not found.");
                }

                await member.roles.remove(role);
                message.channel.send(`${member.user.tag} has been unmuted`);
            } catch (error) {
                console.error(error);
                message.reply("I couldn't add the role. Check my permissions or if the role is above my bot's role.");
            }
        }
        if (CMD_NAME === 'mute') {

            try {
                const member = await message.guild.members.fetch(args[0]);
                const role = await message.guild.roles.fetch('1348372051102273590');
                const duration = await parseInt(args[1]);

                
                if (!member) {
                    return message.reply("Member not found.");
                }

                if (!role) {
                    return message.reply("Role not found.");
                }


                await member.roles.add(role);
                message.channel.send(`${member.user.tag} has been given the ${role.name} role.`);
            
    
                    // Automatically unmute after the specified duration
                    setTimeout(async () => {
                        await member.roles.remove(role);
                        await message.reply(`${member.user.tag} has been unmuted.`);
                    }, duration * 1000);
                }
           
            catch (error) {
                console.error(error);
                message.reply("I couldn't add the role. Check my permissions or if the role is above my bot's role.");
            }



        }

        if(CMD_NAME === 'dumb'){

            rand_value = Math.floor(Math.random() * 101);
            message.reply('You are ' + rand_value + "% dumb");
        }

        if(CMD_NAME === 'toss'){

            rand_num = Math.floor(Math.random() * 2);
            if(rand_num == 0){
                message.reply('Heads!');
            }
            else{
                message.reply('Tails!');
            }
        }

        if(CMD_NAME === 'roll'){

            let roll_number = Math.floor(Math.random() * (7 - 1 + 1) + 1);
       
            message.reply(`You got a ${roll_number}`);
        };

        if(CMD_NAME === 'rand'){

            if(!args[0] || !args[1]){
                message.reply('Please provide a Starting and Ending range!');
                return;
            }
            else{ 

            console.log(args);

            let start_digit = Number.parseInt(args[0]);

            let end_digit = Number.parseInt(args[1]);

            let rand_num = Math.floor(Math.random() * (end_digit - start_digit + 1) + start_digit);

            message.reply(`🎲 Random number: **${rand_num}**`);

                }
        }
    }
    if (message.content.startsWith("Create")) {
        message.reply({
            content: "Create deez nutz on your face"
        })


    }
})

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'channel') {
        await interaction.reply('📺 Check out my YouTube channel here: https://www.youtube.com/@Z-T_Editz/shorts')
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong')
    }
})


client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN).catch(console.error);
