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
  if (mentioned(message)) {
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

  // remove mentioned contact user
  content = content.replace(/@\S+[^\S]+/g, "").replace(/@\S+/, "")

  request.post("http://www.tuling123.com/openapi/api", {
     body: {
       key: apiKey,
       info: content,
       userid: message.from()
     },
     json: true
    }, (error, result, body) => {
       if(error) {
        console.log("request error: ", error)
      } else {
       // console.log("from tuling: ", body)
        message.say(composeMessage(body))
      }
    })
}

function composeMessage (body) {
  delete body.code
  return Object.keys(body).reduce((result, key) => result + "\n" + body[key], "").slice(1)
}

function mentioned (message) {
  const mentionedList = message.mentioned()
  const mentionedBySystem = mentionedList.find(member => member.name() === botNickName)

  const content = message.content()
  const mentionedByReg =
  	new RegExp("\@" + botNickName + "\ ").test(content)
  	|| new RegExp("\@" + botNickName + "$").test(content)
  return mentionedBySystem || mentionedByReg
}
