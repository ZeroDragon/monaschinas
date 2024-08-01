import '../../dotenv.mjs'
import './bot.mjs'
import express from 'express'
import search from './search.mjs'
import mangaData from './fetcher.mjs'
import user from './models/user.mjs'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.set('views', './')
app.set('view engine', 'pug')

// add support for cors
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.get('/api/manga/:manga/:chapter?/:season?', (req, res) => {
  const { manga, chapter, season } = req.params
  mangaData(manga, season, chapter)
    .then(data => {
      res.json(data)
    })
    .catch(error => {
      console.error('Error fetching XML:', error)
      res.status(500).send
    })
})

app.post('/api/search', async (req, res) => {
  res.json(await search(req.body.query.toLowerCase()))
})

app.get('/api/', (_req, res) => {
  res.json({ message: 'Hello world' })
})

app.post('/api/signup', async (req, res) => {
  console.log('here')
  const { username, password, phone } = req.body
  res.json(await user.signup(username, password, phone))
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  res.json(await user.login(username, password))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})