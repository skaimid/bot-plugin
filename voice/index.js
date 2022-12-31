'use strict'
const { segment, record } = require('icqq')
const path = require('path')
const cron = require('node-cron')

const tasks = []

const anwser = {
    任何邪恶: 'xiee.mp3',
    好好的看着我: 'shenli.mp3',
    罕见: 'hanjian.mp3',
    答辩: 'xiee.mp3'
}

function getRandomInt (max) {
    return Math.floor(Math.random() * max)
}

function listener (msg) {
    if (msg.raw_message) {
        if (getRandomInt(5) === 1) {
            const vpath = path.join(
                __dirname,
                './voice',
                `${getRandomInt(11) + 1}.mp3`
            )
            msg.reply([segment.record(vpath)])
        }
        for (const keyword in anwser) {
            if (Object.hasOwnProperty.call(anwser, keyword)) {
                const filename = anwser[keyword]
                if (msg.raw_message.indexOf(keyword) !== -1) {
                    const vpath = path.join(
                        __dirname,
                        './voice',
                        filename
                    )
                    msg.reply([segment.record(vpath)])
                }
            }
        }
    }
}

function enable (bot) {
    bot.on('message', listener)
    tasks.push(cron.schedule('0 8 * * *', async () => {
        await this.sendGroupMsg('569027580', record(path.join(
            __dirname,
            './voice',
            'zao.mp3'
        )))
    }))
    tasks.push(cron.schedule('30 12 * * *', async () => {
        await this.sendGroupMsg('569027580', record(path.join(
            __dirname,
            './voice',
            'zhong.mp3'
        )))
    }))
    tasks.push(cron.schedule('0 18 * * *', async () => {
        await this.sendGroupMsg('569027580', record(path.join(
            __dirname,
            './voice',
            'wan.mp3'
        )))
    }))
    tasks.push(cron.schedule('30 22 * * *', async () => {
        await this.sendGroupMsg('569027580', record(path.join(
            __dirname,
            './voice',
            'wanan.mp3'
        )))
    }))

    tasks.forEach(task => task.start())
}
function disable (bot) {
    bot.off('message', listener)
    tasks.forEach(task => task.destroy())
}

module.exports = {
    id: 'tech.saltyfish.voice',
    shortName: '语音烂活',
    enable,
    disable
}
