'use strict'
const { segment } = require('icqq')
const fs = require('fs')
const path = require('path')
const download = require('download')

const keyWordsMap = [
    {
        keywords: ['舟', '粥', '粥粥'],
        ch: 'ArkPics'
    },
    {
        keywords: ['原', '原神', '烧鸡'],
        ch: 'GenShinPicBed'
    },
    {
        keywords: ['三次元', '3'],
        ch: 'GFW3DS'
    },
    {
        keywords: ['二次元', '2'],
        ch: 'GfWR16'
    },
    {
        keywords: ['铜'],
        ch: 'moeisland'
    },
    {
        keywords: ['猫', 'cat'],
        ch: 'miaowu'
    }
]

const sendRandImg = (msg, ch) => {
    try {
        download(`http://127.0.0.1:8000/tg/randomPic?name=${ch}`).then((res) => {
            const imgpath = path.join(
                __dirname,
                '../../tempImg',
                `${Date.now()}-${Math.random()}.jpg`
            )
            console.log(imgpath)
            fs.writeFile(imgpath, res, (err) => {
                if (err) {
                    throw err
                }
                const responseMsg = ['吟唱开始', segment.image(imgpath)]
                msg.reply(responseMsg)
            })
        })
    } catch (e) {
        console.log(e)
        msg.reply('出错啦')
    }
}

function listener (msg) {
    if (msg.raw_message && msg.raw_message.startsWith('#吟唱')) {
        let sent = false
        console.log(keyWordsMap)
        for (const item of keyWordsMap) {
            for (const keyword of item.keywords) {
                if (sent) {
                    break
                }
                if (msg.raw_message.indexOf(keyword) > 0) {
                    sendRandImg(msg, item.ch)
                    sent = true
                    break
                }
            }
        }
        if (!sent) {
            const index = Math.floor(Math.random() * keyWordsMap.length)
            console.log(index)
            sendRandImg(msg, keyWordsMap[index].ch)
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
    id: 'tech.saltyfish.randPic',
    shortName: '随机图片',
    enable,
    disable
}
