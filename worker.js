const Twitter = require('twitter')
const admin = require('firebase-admin')
const serviceAccount = require('./private-key')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reactbkk-tweets.firebaseio.com'
})

const db = admin.database()
const ref = db.ref('tweets/reactbkk')

console.log('Streaming started...')
const stream = client.stream('statuses/filter', { track: 'reactbkk' })
stream.on('data', function (event) {
  if (event.delete && event.delete.status) {
    ref.child(padId(event.delete.status.id_str))
    return
  }
  if (!event.id_str) {
    return
  }
  const id = padId(event.id_str)
  console.log(`[${new Date()}] Received tweet ${event.id_str}`)
  ref.child(id).set(event)
})

function padId (id) {
  while (id.length < 20) id = `0${id}`
  return id
}
