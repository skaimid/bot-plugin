'use strict'
const { segment } = require('icqq')
const path = require('path')

const anwser = {
    任何邪恶: 'xiee.mp3',
    好好的看着我: 'shenli.mp3',
    罕见: 'hanjian.mp3',
    答辩: 'xiee.mp3'
}

// function getRandomInt (max) {
//     return Math.floor(Math.random() * max)
// }

function listener (msg) {
    if (msg.raw_message) {
        // if (getRandomInt(5) === 1) {
        //     const vpath = path.join(
        //         __dirname,
        //         './voice',
        //         `${getRandomInt(11) + 1}.mp3`
        //     )
        //     msg.reply([segment.record(vpath)])
        // }
        for (const keyword in anwser) {
            const filename = anwser[keyword]
            if (msg.raw_message.indexOf(keyword) !== -1) {
                const vpath = path.join(
                    __dirname,
                    './voice',
                    filename
                )
                try {
                    msg.reply(segment.record(vpath))
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
}

function enable (bot) {
    bot.on('message', listener)
}
function disable (bot) {
    bot.off('message', listener)
}

module.exports = {
    id: 'tech.saltyfish.voice',
    shortName: '语音烂活',
    enable,
    disable
}
