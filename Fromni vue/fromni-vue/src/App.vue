<template>
<div id="app" >
  <h2>Fromni</h2>
<div class="contyner">
  <form @submit.prevent="addCampaign" class="addCompany">  
    <h2>Добавить Кампанию</h2>
    <label for="campaignName">Название Кампании:</label>
    <input type="text" id="campaignName" v-model="newCampaign.campaignsName" required>
    <br>
    <input type="checkbox" value="ВКонтакте" @change="updateChannels"> ВКонтакте
    <input type="checkbox" value="Telegram" @change="updateChannels"> Telegram
    <input type="checkbox" value="WhatsApp" @change="updateChannels"> WhatsApp
    <input type="checkbox" value="SMS" @change="updateChannels"> SMS

    <br>
    <button type="submit">Добавить</button>
  </form>


  <!-- Отображение списка кампаний -->
<div v-for="campaign in campaigns" :key="campaign._id" >
  <h2>Компания {{ campaign.name }}</h2>

  <div v-for="channel in campaign.channels" :key="channel.name" class="infoCompan">   
    <div>
      <div class="campaign">
        <h3>{{ channel.name }}</h3>
        <textarea v-model="channel.message" :maxlength="maxTextLength[channel.name]"></textarea>

        <div>
          <input v-model="newButton.text" placeholder="Текст кнопки">
          <input v-model="newButton.callback_data" placeholder="Callback Data">
          <button @click="addButton(channel, newButton)">Добавить кнопку</button>
        </div>
        
        <button @click="addMessage(campaign.name, channel.name, channel.message)">Отправить</button>
      </div>
    </div>
 
  

  <div class="mesageSise"> 
    <div v-for="message in channel.messages" :key="message.text" class="message">
      <div class="messageText">
      <p>{{ message.user }}: </p>
      <p>{{ message.text }}</p>
      </div>     
     <!-- <p>{{ message.timestamp }}</p> -->
    </div>  
  </div> 
  </div>

</div>

    

</div>
</div>
</template>

<script>
import axios from 'axios';
const api_url = "http://localhost:3000/";
export default {
  name: 'App',
  data() {
    return {
      campaigns: [],
      newCampaign:{
        campaignsName: "",
        channels:[]
      },
      newButton: {
      text: '',
      callback_data: '',
    },
      keyboard: {
        inline_keyboard: [
          [
            { text: 'Кнопка 1', callback_data: 'button1' },
            { text: 'Кнопка 2', callback_data: 'button2' },
          ],
        ],
      },
      maxTextLength: {
        "ВКонтакте": 4096,
        "Telegram": 4096,
        "WhatsApp": 1000,
        "SMS": 0
      }
    }
  },
  methods: {
    // Получения инфы с компании
    async getCampaign() {
      const response = await axios.get(api_url + "api/getCampaigns");
      this.campaigns = response.data;
    },
    // Добавить компанию
    async addCampaign() {
        const response = await axios.post(api_url + 'api/addCampaign', this.newCampaign);
        this.getCampaign(); 
    },
    // Оптравить сообщение
   async addMessage(campaignName, channelName, channelNewMessage) {
        const response = await axios.post(api_url + 'api/addMessage', {
          campaignName: campaignName,
          channelName: channelName,
          channelMessage: channelNewMessage,
          inline_keyboard: this.keyboard
        });
        this.getCampaign();
    },



  // Checkbox
    updateChannels(event) {
    const value = event.target.value;
    if (event.target.checked) {
      // Если чекбокс выбран, добавьте значение в массив
      this.newCampaign.channels.push(value);
    } else {
      // Если чекбокс снят, удалите значение из массива (если оно там есть)
      const index = this.newCampaign.channels.indexOf(value);
      if (index !== -1) {
        this.newCampaign.channels.splice(index, 1);
      }
    }
  },
  },
  mounted() {
    this.getCampaign();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.contyner{
  width: 1920;
  height: 1080;
  display: flex;
  flex-direction: column
}
.infoCompan{
display: flex;
justify-content: center
}
.campaign{
  margin: 10px 30px 10px 30px;
  padding: 20px;
  display: flex;
  flex-direction: column
}
.message{
  display: flex;
}
.messageText{
  display: flex;
}
.mesageSise{
  width: 500px;

  max-height: 200px;
  overflow: auto;
  position: relative;
}
.mesageSise:after {
   height: 100%; /* Занимаем всю высоту блока */
   width: 1px; /* Ширина псевдоэлемента (может быть нулевой) */
   position: absolute;
   bottom: 0; /* Размещаем его внизу блока */
}
</style>



  <!-- <select v-model="channel.keyboardMode">
      <option value="standard">Стандартное отображение</option>
      <option value="inline">Inline-отображение</option>
    </select>       
    <div v-if="channel.keyboardMode === 'inline'">
      <button v-for="button in channel.buttons" :key="button._id" @click="addQuickReply(channel, button.text)">{{ button.text }}</button>
    </div> 

    <input type="text" v-model="channel.button">
    <button @click="addButton(campaign.name, channel.name, channel.button)">Добавить</button>  -->


    
    <!--Метод  async addButton(campaign, channel, channelButton) {
      const buttonText = channelButton;
      const campaignName = campaign; // Получите campaignId из компании
      const channelName = channel;
        try {
          // Отправляем данные о новой кнопке на сервер
          const response = await axios.post(api_url + 'api/addButton', {
            campaignName: campaignName,
            channelName: channelName,
            buttonText: buttonText,
          });
          this.getCampaign();     
        } catch (error) {
          console.error('Ошибка при добавлении кнопки:', error);
        }
    }, -->