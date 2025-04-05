const { Client, Events, GatewayIntentBits, Attachment, AttachmentBuilder, Collection, Partials } = require('discord.js');
const axios = require('axios');
const schedule = require('node-schedule');
const svgCaptcha = require('svg-captcha');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({


    intents:
        [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds, // Essential for guild-related data (like channels)
        GatewayIntentBits.GuildMessages, // For message-based interactions
        GatewayIntentBits.GuildVoiceStates // For voice channel data
       

        ]
},
    {
        partials: ['MESSAGE', 'CHANNEL', 'REACTION']
    }

);


client.login(
    process.env.TOKEN
)



const PREFIX = "!"

// Verification handling

client.once('ready', (message) => {
    console.log(`${client.user.tag} is online!`);
})

// Reaction Roles

client.on('ready', async () => {
    console.log(`${client.user.tag} is online!`);

    const channel = await client.channels.fetch('1354625234304766042'); // Replace with your channel ID
    const message = await channel.messages.fetch('1354625600412713022'); // Replace with your message ID

    // Auto React

    await message.react('❤️');
    await message.react('💙');

    // Reaction collector filter
    const filter = (reaction, user) => !user.bot; // Ignore bot reactions

    // Create a collector for reactions
    const collector = message.createReactionCollector({ filter, dispose: true });

    collector.on('collect', async (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        const member = await reaction.message.guild.members.fetch(user.id);

        switch (reaction.emoji.name) {
            case '❤️':
                await member.roles.add('1354625276100874240'); // Replace with your role ID
                console.log(`Assigned ❤️ role to ${user.tag}`);
                break;
            case '💙':
                await member.roles.add('1354625373425631355'); // Replace with your role ID
                console.log(`Assigned 💙 role to ${user.tag}`);
                break;
        }
    });

    collector.on('remove', async (reaction, user) => {
        console.log(`Removed ${reaction.emoji.name} from ${user.tag}`);
        const member = await reaction.message.guild.members.fetch(user.id);

        switch (reaction.emoji.name) {
            case '❤️':
                await member.roles.remove('1354625276100874240');
                console.log(`Removed ❤️ role from ${user.tag}`);
                break;
            case '💙':
                await member.roles.remove('1354625373425631355');
                console.log(`Removed 💙 role from ${user.tag}`);
                break;
        }
    });
});



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
            
            *More commands to be added in the future*
            `;
            
            message.channel.send(`\`\`\`${commandInfo}\`\`\``);
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

        if(CMD_NAME === 'meme'){
           
                const response = await fetch('https://meme-api.com/gimme');
                const data = await response.json();

                if(!data){
                    message.reply('Error! Couldn\'t fetch data from API!');
                }

                message.channel.send({
                    embeds: [{
                        title: data.title,
                        image: {url: data.url},
                        footer: {text: `👍 ${data.ups} upvotes`},
                        color: 0x00FF00
                    }]
                })
            
        }

        if(CMD_NAME === 'server'){

            await message.guild.channels.fetch()

            const name = message.guild.name
            const date = message.guild.createdAt.toLocaleString()
            const members = message.guild.memberCount.toLocaleString();
            const botCount = message.guild.members.cache.filter(member => member.user.bot).size;
            const boostLevel = message.guild.premiumTier.toLocaleString();
            const channelCount = message.guild.channels.cache.filter(channel => channel.type === 0 || channel.type === 2).size;
            const textChannelCount = message.guild.channels.cache.filter(c => c.type === 0).size; // Text channels
            const voiceChannelCount = message.guild.channels.cache.filter(c => c.type === 2).size; // Voice channels
            const categoryCount = message.guild.channels.cache.filter(c => c.type === 4).size; // Categories
            
            message.reply(`**Basic Information** \n 
                    \nServer Name: ${name}
                    \nServer Created at: ${date} 
                    \nTotal Members: ${members} 
                    \nBot Count: ${botCount} 
                    \nCurrent Boost Level: ${boostLevel}
                    \n**Channel Detail** \n
                    \nNumber of channels: ${channelCount} 
                    \nNumber of Text Channels: ${textChannelCount} 
                    \nNumber of Voice Channels: ${voiceChannelCount}
                    \nNumber of Categories: ${categoryCount}
                    `);
                    
        }


        if(CMD_NAME === 'weather'){
            const args = message.content.split(' ');
            const city = args.slice(1).join(' '); // grab everything after the command

            if(!city) return message.channel.send('Please provide a city name!');

            const url =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}&units=metric`;
           
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
    
                if(data.cod != 200) return message.reply(`Error! ${data.error}`);
    
                const weatherInfo = `🌍 **Weather in ${data.name}:**
                                    🌡️ Temperature: ${data.main.temp}°C
                                    🌤️ Weather: ${data.weather[0].main} - ${data.weather[0].description}
                                    💨 Wind: ${data.wind.speed} m/s
                                    💧 Humidity: ${data.main.humidity}%`;
    
                message.channel.send(weatherInfo);
    
            } catch (err) {
                console.log(err);
                message.reply('Something went wrong!');
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
