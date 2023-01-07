'use strict'
const { segment } = require('icqq')
const path = require('path')
const Jimp = require('jimp')

async function rotate (file) {
    try {
        const imgpath = path.join(
            __dirname,
            '../../tempImg',
            `${Date.now()}-${Math.random()}.jpg`
        )
        // 读取图片
        const image = await Jimp.read(file)
        await image.rotate(1)
        // 保存
        await image.writeAsync(imgpath)
        return imgpath
    } catch (e) {
        console.log(e)
    }
}

function listener (msg) {
    let count = 1
    const reply = []
    if (msg.raw_message && msg.raw_message.startsWith('#吟唱')) {
        const command = msg.raw_message.split(' ')
        // if (!command[1]) {
        //     msg.reply('未指定类型，发送随机类型')
        // }
        if (command[2] && Number(command[2]) && Number.isInteger(Number(command[2]))) {
            count = Number(command[2])
            if (count < 1) {
                count = 1
                msg.reply('数量必须大于1')
            }
            if (count > 15) {
                count = 15
                msg.reply('数量必须小于15')
            }
        } else {
            command[2] && msg.reply(`数量 ${command[2]} 不能解析为整数，请输入正确的数字`)
        }
        msg.reply('吟唱准备中~')
        fetch(`https://image.anosu.top/pixiv/json?num=${1}&keyword=${command[1]}&proxy=i.pixiv.re`)
            .then(res => res.json())
            .then(rs => {
                console.log(rs)
                if (!rs || rs.length === 0) {
                    msg.reply(['笑死，没找到呢~你个大傻杯~xp太怪了吧~', segment.image(path.join(
                        __dirname,
                        '../../tempImg',
                        'sb.jpg'
                    ))])
                    return
                }
                for (const img of rs) {
                    console.log(img)
                    rotate(img.url).then((path) => {
                        msg.reply([
                            segment.image(path),
                            `pixiv pid ${img.pid}\n`,
                            img.tags.reduce((pre, cur) => pre.concat(`#${cur} `), '')
                        ])
                    })
                }
                msg.reply(reply)
            }).catch(e => {
                console.log(e)
                msg.reply('出错啦~')
            })
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
