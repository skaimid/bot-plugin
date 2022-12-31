'use strict'
const { segment } = require('icqq')
const sagiri = require('sagiri')

const client = sagiri('e12136de8562e263f8ac459b60cf0694078234ed')

function listener (msg) {
    if (msg.raw_message && msg.raw_message.startsWith('搜图')) {
        const imgMsgEl = msg.message.find((item) => item.type === 'image')
        if (imgMsgEl && imgMsgEl.url) {
            client(imgMsgEl.url, { mask: [5] })
                .then((res) => {
                    console.log(JSON.stringify(res))
                    let responseMsg = [
                        `${res && res.length > 0 ? '搜索结果：\n' : '未搜索到'}`
                    ]
                    res.forEach((el) => {
                        const msgSeg = [
                            segment.image(el.thumbnail),
                            `相似度${el.similarity} (${el.similarity > 60 ? 'High' : 'Low'
                            }) \n${el.url}\n`
                        ]
                        console.log(msgSeg)
                        responseMsg = responseMsg.concat(msgSeg)
                    })
                    console.log(JSON.stringify(responseMsg))
                    msg.reply(responseMsg)
                })
                .catch((e) => {
                    msg.reply('看起来坏了')
                    console.log(e)
                })
        } else {
            msg.reply('你图呢？')
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
    id: 'tech.saltyfish.picSearch',
    shortName: '搜图',
    enable,
    disable
}
