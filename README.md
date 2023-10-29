# Bot Conversation

## Introduction

Bot conversation is chat web application with backend within in nodejs (typescript) and a frontend mobile application for the iOS platform.
The project allows it's users to chat with an AI bot (a Chat GPT model) concerning artists and their albums.
Server side deployment of the project has been testing using Firebase hosting (with SSR handled by Firebase functions).

## Technologies Used

- [Cody](https://getcody.ai) - An I bot that is used for the chat. It works like chat-gpt and can be trained on any topic of your choice
- [Nodejs](https://nodejs.org/en) - Server Side Rending (SSR) is handled via a nodejs runtime
- [Astro](https://astro.build/) - was used to build the chatting experience. There is another alternative that could have been used [Nextjs](https://nextjs.org/), but I decided to go with Astro for this one
- [Tailwind](https://tailwindcss.com/) - For frontend rendering, I employed the use of Tailwind, a css styling toolkit
- [Bootstrap](https://getbootstrap.com/) - I also employed Bootstrap for ease of UI building. Added bootstrap here just because of one component (on a production app, I wouldn't do this because it an unwanted overhead, adding a library as a dependency just because of a single easy component)
- [Swift](https://developer.apple.com/swift/) - The project comes with a mobile application that embeds the chat system using WkWebView

## Setup
To setup the project you need to first install the nodejs dependencies and then run the server side code. The server app root is located at `./prime-node` which we will refer to as `$server_root` and the xcode project root is located at `./bot-talk-swift` which will be referred to as `$app_root`

### Server Side Setup
Before continuing with the server setup, make sure you have the following handy
- Nodejs - It is assumed you already have the latest version of nodejs setup on your machine (version 20.9.0 at the time of this writing). Visit [https://nodejs.org/en]((https://nodejs.org/en)) to get node installed
- Cody AI - The application uses [Cody AI](https://getcody.ai/). **Note** For you to use the chat functionality, you must create various Chat Bot on Cody. The various Bots created on Cody are used as topics which you can interact with. You can create your bot here [https://getcody.ai/bots](https://getcody.ai/bots)
- [Firebase Project](https://console.firebase.google.com/) - To host the application, you require a firebase project (or any other node service provider with support for SSR. Astro supports Cloudflare, Netify, Vercel. However this has been tested with firebase
- Server Environment File - create a new  `.env` file in the `$server_root` directory and include the following content in that file
```bash
CODY_API_KEY=#Replace with your CODY API key
# The Cody API endpoint defaults to https://getcody.ai/api/v1
CODY_BASE_URL=https://getcody.ai/api/v1
```

#### Setting up Cody
Sign-In to your [Cody AI](https://getcody.ai/) account (or create one if you do not have one yet). After sign-in, go to the [API Integrations Page](https://getcody.ai/settings/api) and create a new API key. Copy the new key and place and the value for the environment `CODY_API_KEY` in your `$server_root/.env` file

#### Install Project Dependencies
To install the project dependencies, switch directory to the `$server_root`  and run the following commands
```bash
# if using npm
npm install
# if using yarn
yarn
```

#### Setup Firebase
To host the application on your firebase project, you need you install the [Firebase CLI](https://firebase.google.com/docs/cli). At least version 12.7.0 is required in order to make use of the webframeworks feature (an experimental feature at the time of this writting) which allows you to host SSR sites for project developed with popular web frameworks (Astro, Nextjs, Flutter web, etc).

After installing the firebase cli follow the steps below to setup your project for firebase

- Login to firebase using the command `firebase login`
- Enable the firebase webframeworks feature `firebase experiments:enable webframeworks`
- Open the file `$server_root/.firebaserc` and change the project id (i.e *projects.default*) to your own firebase project ID. **Note** because this project uses webframework (i.e Firebase functions) you have to enable your firebase project for the *Blaze (pay-as-you-go) plan*. You can upgrade by visiting the url [https://console.firebase.google.com/project/{your_project_id_here}/usage/details](https://console.firebase.google.com/project/{your-project-id}/usage/details)
- Deploy the project to firebase using the `firebase deploy` command. This would deploy the project to your firebase account and provide you with the url which can be used to access the project. Take note of the URL as it will be needed to configure the iOS application
- You can now load the app using the generated URL firebase deploy provided for you

*Important*
It is important to note that the chat works in the context of a particular music information. You will observe that loading the URL would just display a spinning loader. You can trigger the chat experience by loading a sample music information e.g

```javascript
$prime.triggerEvent('PLAYLIST_INFO_LOADED', {
  "artistName":"Sample Artist",
  "currentTrack":"Sample Song",
  "lastChatTopic":"Jokes",
  "albumName":"Sample Album"
});

```

### iOS App Setup
To setup the iOS application, we need to provide the URL generated by firebase deploy for xcode to use. To do this, follow the steps below
- Navigate to the directory `$app_root/bot-talk-swift/env`
- Create a new file called `env.xcconfig`
- Place the following content into that file
```swift
CHAT_BOT_HOST=<your_firebase_project_url>
```
**Note** this config file supports commenting (of which xcode uses *//* as the comment delimeter. You will therefore need to escape certain characters in your url. For example, let assume the firebase generated url was `https://bot-conversation-9829.web.app`, then the content of this file will be 
```swift
//Noticed how I escaped the double forward slashes \/\/
CHAT_BOT_HOST=https:\/\/bot-conversation-9829.web.app
```