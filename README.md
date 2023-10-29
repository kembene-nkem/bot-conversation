# HeadingBot Conversation

## Introduction
Bot conversation is chat web application with backend within in nodejs (typescript) and a frontend mobile application for the iOS platform.
The project allows it's users to chat with an AI bot (a Chat GPT model) concerning artists and their albums.
Server side deployment of the project has been testing using Firebase hosting (with SSR handled by Firebase functions).

## Technologies Used
- [Nodejs](https://nodejs.org/en) - Server Side Rending (SSR) is handled via a nodejs runtime
- [Astro](https://astro.build/) - was used to build the chatting experience. There is another alternative that could have been used [Nextjs](https://nextjs.org/), but I decided to go with Astro for this one
- [Tailwind](https://tailwindcss.com/) - For frontend rendering, I employed the use of Tailwind, a css styling toolkit
- [Bootstrap](https://getbootstrap.com/) - I also employed Bootstrap for ease of UI building. Added bootstrap here just because of one component (on a production app, I wouldn't do this because it an unwanted overhead, adding a library as a dependency just because of a single easy component)
- [Swift](https://developer.apple.com/swift/) - The project comes with a mobile application that embeds the chat system using WkWebView

## Setup