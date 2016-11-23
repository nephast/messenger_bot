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
            sendGenericMessage(sender)
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

function sendGenericMessage(sender) {
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
                        "url": "https://goo.gl/photos/HSVG2RHZJKxnHWPM9",
                        "title": "See original"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
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
