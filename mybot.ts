const { Wechaty } = require('wechaty')
// const request = require("superagent")
const request = require("request")

const bot = Wechaty.instance()
const botNickName = "小诸葛"
const apiKey = "cdb88a67f046467dabbc40f01ead883b"

bot

.on("scan", (url, code) => {
  const loginUrl = url.replace("qrcode", "l")
  require("qrcode-terminal").generate(loginUrl)
})

.on("login", user => {
  console.log(`${user} login `)
})

.on("logout", user => {
  console.log(`${user} logout`)
})

.on("message", handleMessage)

.init()

function handleMessage (message) {
  if(message.self()) {
    return
  }

  if(message.room()) {
    handleRoomMessage(message)
  } else {
    handleNormalMessage(message)
  }
}

function handleRoomMessage (message) {
  // const room = message.room()
  // const contact = message.from()
  const mentionedList = message.mentioned()
  const botMentioned = mentionedList.find(member => {
    return member.name() === botNickName
  })
  if (botMentioned) {
    respondAI(message)
  }
}

function handleNormalMessage (message) {
  respondAI(message)
}

function respondAI (message) {
  let content = message.content()

  if(typeof content !== "string") {
    content = content.toString()
  }

  request.post("http://www.tuling123.com/openapi/api", {
     body: {
       key: apiKey,
       info: content,
       userid: "poberwong"
     },
     json: true
    }, (error, result, body) => {
       if(error) {
        console.log("request error: ", error)
      } else {
       // console.log("from tuling: ", body)
        message.say(body.text)
      }
    })

}