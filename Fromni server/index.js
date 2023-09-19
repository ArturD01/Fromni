const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const TelegramApi = require('node-telegram-bot-api')

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB
const uri ='mongodb+srv://Artur:1234@atlascluster.n8koo58.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';
const databaseName = 'Fromny';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let database;
let resultJson;

// Telegram
const token = '5575087374:AAFvUj5HnmgAy8H6kYii5I9IZGLN7iRrm8w'
const bot = new TelegramApi (token, {polling:true})




//MongoDB-Express
// Чтение
app.get('/api/getCampaigns', async (req, res) => {
  const myColl = database.collection('campaigns');
  const result = await myColl.find({}).toArray();
  resultJson = JSON.stringify(result);
  res.send(resultJson);
});
// Добавление компаний
app.post('/api/addCampaign', async (req, res) => {
  try {
    const myColl = database.collection('campaigns');
     // const newCampaign = req.body;
     const channels = req.body.channels.map(channelName => {
      return {
        name: channelName,
        messages: [],
        buttons:[]
      };
    });
    const newCampaign = {
      name: req.body.campaignsName,
      channels: channels,
    };
    const result = await myColl.insertOne(newCampaign);
  } catch (error) {
    console.error('Ошибка при добавлении Кампании:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении Кампании' });
  }
});
// Отправка сообщений
app.post('/api/addMessage', async (req, res) => {
    const myColl = database.collection('campaigns');
    const { campaignName, channelName, channelMessage,inline_keyboard} = req.body;

    if (channelName == "Telegram") {
      const channel_id = 5536300885;   
      const options = {
        reply_markup: inline_keyboard,
      };
      bot.sendMessage(channel_id, channelMessage, options);
    }
    const newMessage = {
      user: "p1",
      text: channelMessage,
      timestamp: new Date(),
    };
    const query = {
      name: campaignName,
      "channels.name": channelName,
    };
    const update = {
      $push: {
        "channels.$.messages": newMessage,
      },
    };
    const result = await myColl.updateOne(query, update);
    res.status(201).json(result);
});

// Добавление кнопок
app.post('/api/addButton', async (req, res) => {
  try {
    const myColl = database.collection('campaigns');
    const { campaignName, channelName, buttonText } = req.body;
    const newButton = {
      text: buttonText,
    };
    const query = {
      name: campaignName, 
      "channels.name": channelName,
    };
    const update = {
      $push: {
        "channels.$.buttons": newButton,
      },
    };
    const result = await myColl.updateOne(query, update);
    res.status(201).json(result);
  } catch (error) {
    console.error('Ошибка при добавлении кнопки:', error);
    res.status(500).json({ error: 'Произошла ошибка при добавлении кнопки' });
  }
});

bot.on('message', async (msg) => {
  const myColl = database.collection('campaigns');
  const { text, chat } = msg;
    const newMessage = {
      user: "p2",
      text: text,
      timestamp: new Date(),
    };
    const query = {
      name: "ArtQo",
      "channels.name": "Telegram",
    };
    const update = {
      $push: {
        "channels.$.messages": newMessage,
      },
    };
    const result = await myColl.updateOne(query, update);  
});

app.listen(3000, async () => {
  try {
    await client.connect();
    database = client.db(databaseName);
    console.log('Подключено к MongoDB');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  }
});