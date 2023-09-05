import TelegramBot from 'node-telegram-bot-api'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import schedule from 'node-schedule'

dotenv.config()

const __dirname = path.resolve()
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatId = process.env.CHAT_ID
const userId = process.env.USER_CHAT_ID

// Функция для отправки случайной картинки из папки 'images'
const sendRandomImage = () => {
  const images = fs.readdirSync(path.join(__dirname, 'images'))
  if (images.length === 0) {
    console.error('No images found in the "images" directory.')
    return
  }

  const randomImage = images[Math.floor(Math.random() * images.length)]

  // Пересылка изображения от моего аккаунта в группу
  bot
    .sendMessage(chatId, 'С добрым утром всех!', {
      from: userId,
    })
    .then(() => {
      // Отправить изображение
      bot
        .sendPhoto(chatId, path.join(__dirname, 'images', randomImage))
        .then(() => {
          console.log(`Sent image: ${randomImage}`)
        })
        .catch((error) => {
          console.error(`Error sending image: ${error.message}`)
        })
    })
    .catch((error) => {
      console.error(`Error forwarding message: ${error.message}`)
    })
}

// Запланировать отправку каждое утро в 6:30
const morningJob = schedule.scheduleJob('30 6 * * *', () => {
  sendRandomImage()
})

console.log('Bot is running...')
