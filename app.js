'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Stephan') {
            sendStephanMessage(sender)
            continue
        }
        if (text === 'Matrina') {
            sendMatrinaMessage(sender)
            continue
        }
        sendTextMessage(sender, "Did you just say: " + text.substring(0, 200) + " ?")
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

const token = process.env.FB_PAGE_ACCESS_TOKEN

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendStephanMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Stéphan",
                    "subtitle": "Nice hair!",
                    "image_url": "https://lh3.googleusercontent.com/ui9s3vRcu-yw4G2BmW64C84NdtmEhSE9aAiLgopvZcq-WsjOdu8EySNxA5uJTPi2AeM9gZ9c1BYnYFWZld-onUSVPloPV5_7de6W6TAG1IydQotoU976irJporWp1-1nSkWkdK7yr8jz5gnKq5dPUeWUbGL0x5IGBOL_fRw7GiimhpbgX_pllUuy2KV1xpJLD02ZEKkacAPTJMPw4hMF0sdaiDF5GK-IZps4-vqTSQ-3Jq0wLjt-15ABNKA35OHtTK33TetUWLRVAh52nK4_zdzb9VnjusPHQEDISO49WZlSrI_lXw5oaFlnjrg3EyVj_B0lmLgnizjwn5IKrZKRNh-8GCsJRj16zW6EjzA4dZR6cxk3VMvl1rmEys7DgM9PsN3xWwJXk9DnXqQIBNB2TRsBnh7HglgJGMKkOzD1lAAofLsSjzv7gMMYStg98jiHNSHacrIDnN5GyjK1OIf8OLwdYDrx9Vmd8VmCc62OBAKIwNKH_mE21dZBmoIsWLAFUq4jvNV-ih_dGxfLdvjWx2XUp4EX38RJ13_qVt_bzhLxV6zl05xCIhCnYLhh2eFky5eGWBinD6GZfO4jrb-wFqkU9X4dOiTQio6KqE0XLmc=s680-no",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://lh3.googleusercontent.com/ui9s3vRcu-yw4G2BmW64C84NdtmEhSE9aAiLgopvZcq-WsjOdu8EySNxA5uJTPi2AeM9gZ9c1BYnYFWZld-onUSVPloPV5_7de6W6TAG1IydQotoU976irJporWp1-1nSkWkdK7yr8jz5gnKq5dPUeWUbGL0x5IGBOL_fRw7GiimhpbgX_pllUuy2KV1xpJLD02ZEKkacAPTJMPw4hMF0sdaiDF5GK-IZps4-vqTSQ-3Jq0wLjt-15ABNKA35OHtTK33TetUWLRVAh52nK4_zdzb9VnjusPHQEDISO49WZlSrI_lXw5oaFlnjrg3EyVj_B0lmLgnizjwn5IKrZKRNh-8GCsJRj16zW6EjzA4dZR6cxk3VMvl1rmEys7DgM9PsN3xWwJXk9DnXqQIBNB2TRsBnh7HglgJGMKkOzD1lAAofLsSjzv7gMMYStg98jiHNSHacrIDnN5GyjK1OIf8OLwdYDrx9Vmd8VmCc62OBAKIwNKH_mE21dZBmoIsWLAFUq4jvNV-ih_dGxfLdvjWx2XUp4EX38RJ13_qVt_bzhLxV6zl05xCIhCnYLhh2eFky5eGWBinD6GZfO4jrb-wFqkU9X4dOiTQio6KqE0XLmc=s680-no",
                        "title": "See original"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Walking in the hotel",
                    }],
                }, {
                    "title": "Spooky",
                    "subtitle": "scaryyyyyy",
                    "image_url": "https://lh3.googleusercontent.com/Zi01s-TtOCvGphZ9aR-r6ZyTDyGqQPRE29SKtyxk7Bz6bFAL_6wzWk1Wylhix-tKdWF2zBQ27z5eifXJWXmUf72jxMxKGoJgtP50oA0NhadzLaa32a2m69bvpe8Fx0zVLttf5Yqz-dg63W9Yw2G1auglYeQ40AAGfbjem0HV_NLP24d1U8XRPgWtQAn-09EVFJbvfyLgLVQeTNIW0bqnXIl2zxoEIxWq4-nvfDruqt-ibNtqgHgSOm97mQ4b7IC1o0yDf2uYFyC2D7MUK87az8NnhlISHFEmaSTALh_cdtjLXyuxT4GPLAwQp1RXl5UjD2awefuMGxNSidsFOA_girn2c8dzOlYGryBZBS-jAUo27Uudu1DghatfoPM8ceEWJs3eZ-lHlfmCURyQiNf7LZdRmjJff_2uLOeB0VSi3m_G50TnK98ZIpMTty0W1y8S2TnKmVXnBBlxARqLEcX7SwMV35r42oLwdGSt_7zF4pthyEDhBFVL5CdaULRYbaQdLGdxemsPxpq1E7V_HuV5_2tRWinD8dB89LV8-zVWnYl8N-iUWl0enakhpqmOD4o5TIci7z1Yye-S5OG7nON2kXsSY14MMHH963wATwSxS8Q=s680-no",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Playing tricks to mummy",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendMatrinaMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Matrinoooos",
                    "subtitle": "Colourful",
                    "image_url": "https://lh3.googleusercontent.com/qEJdbkh7xLw3MRjAi_xDmIbizwAUuJ_rOOn3xenL8djUiyzo3fVR7nIOdsiJCkwk3O_QyHO1R-OyQeev-sC7n4NuHeb7wnsT4jEt6VrwxeGy9FVOtfkuR-4oop5WYwMfPp669wwGMgdg1JmHb8dAyWaVWsKYcOke3DVfAk5un-o1QqDHNCP3CR23lLhRTHzj4lKxh6E-21M-y0Uqb-z2f6TkfJElSZeGWLjJa5btRZwTfqsZqhLsKTAo9Y0I9_X7qD0wvVgYeu-NeARk7Up6HXTorVOEGivOmK8rhFU-6zY78DalpjPKRx-vXnLMjN2dbP27r4QiIGwObVBNbSL7Q2KzPLGVJqjnqeAoljubvNGJlM16GRmPC7lHfHuzkVdVDYr_e9ZWgIn5gfRM9lbEmgvbnBMWSZMzhF5f20BYN4WIxMT9mno1Tk-RJN1C4ixpabcBFItxHMm3pY1lz4RzvT1Jbsr_-1I6QvGgHtv_BrQjEUPybqYX9pKgcagolMvaZrRTxj7baSz2T-e4kcaNSI6CffIo6uU5ivcEELoeiSGE0CarrybE-LJMkPTUqSd-Sm_HIQNQIjujjLV1mOrgs4nMEE9mIVuj_I4OxWPNR7s=s680-no",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://lh3.googleusercontent.com/qEJdbkh7xLw3MRjAi_xDmIbizwAUuJ_rOOn3xenL8djUiyzo3fVR7nIOdsiJCkwk3O_QyHO1R-OyQeev-sC7n4NuHeb7wnsT4jEt6VrwxeGy9FVOtfkuR-4oop5WYwMfPp669wwGMgdg1JmHb8dAyWaVWsKYcOke3DVfAk5un-o1QqDHNCP3CR23lLhRTHzj4lKxh6E-21M-y0Uqb-z2f6TkfJElSZeGWLjJa5btRZwTfqsZqhLsKTAo9Y0I9_X7qD0wvVgYeu-NeARk7Up6HXTorVOEGivOmK8rhFU-6zY78DalpjPKRx-vXnLMjN2dbP27r4QiIGwObVBNbSL7Q2KzPLGVJqjnqeAoljubvNGJlM16GRmPC7lHfHuzkVdVDYr_e9ZWgIn5gfRM9lbEmgvbnBMWSZMzhF5f20BYN4WIxMT9mno1Tk-RJN1C4ixpabcBFItxHMm3pY1lz4RzvT1Jbsr_-1I6QvGgHtv_BrQjEUPybqYX9pKgcagolMvaZrRTxj7baSz2T-e4kcaNSI6CffIo6uU5ivcEELoeiSGE0CarrybE-LJMkPTUqSd-Sm_HIQNQIjujjLV1mOrgs4nMEE9mIVuj_I4OxWPNR7s=s680-no",
                        "title": "See original"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Who are they?",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
