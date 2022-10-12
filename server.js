const express = require('express');
import { PORT } from './config'
import DbConnect from './database'
import errorHandler from './middlewares/errorHandler'
import router from './routes'

const app = express()
// DbConnect()

app.use(express.json())

app.use('/api', router)

app.use(errorHandler)
app.listen(PORT, () => console.log(`Port is running on PORT ${PORT}`))
