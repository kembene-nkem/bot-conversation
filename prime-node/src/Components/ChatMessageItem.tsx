import type {BotMessage} from "../Scripts/shared/types.ts";
import {useEffect, useState} from "react";
import type {BotListenerInformation} from "../Scripts/shared/types.ts";
import {getPrimeHome} from "../Scripts/clients/global.ts";

// const eventSourceHolder:any = getPrimeHome().getEventSourceHolder();
export default function ChatMessageItem(props: ChatMessageItemProps) {
    const [message, setMessage] = useState<BotMessage>({})
    const [lastMessageListenerInfo, setLastMessageListenerInfo] = useState<BotListenerInformation | null>(null);
    const [messageToRender, setMessageToRender] = useState("")
    const [waitingForBot, setWaitingForBot] = useState(true);
    const [eventSourceHolder, setEventSourceHolder] = useState<any | null>(null)
    useEffect(() => {
        setEventSourceHolder(getPrimeHome().getEventSourceHolder());
    }, []);
    useEffect(() => {
        setLastMessageListenerInfo(props.messageListenerInfo)
    }, [props.messageListenerInfo]);

    useEffect(() => {
        let newMessage = {...props.message}
        setMessage(newMessage)
        setMessageToRender(newMessage.content ?? "")
        setWaitingForBot(!newMessage.content)
    }, [props.message]);

    useEffect(() => {
        messageListenerInfoChanged();
    }, [lastMessageListenerInfo]);

    const getIdentifier = (): string => {
        return message.message_send_identifier ?? "";
    }

    const cleanupEventSource = () => {
        eventSourceHolder?.closeEventSource(getIdentifier());
    }
    const messageListenerInfoChanged = () => {
        if(lastMessageListenerInfo == null) {
            cleanupEventSource();
            return;
        }
        if(eventSourceHolder == null) {
            return;
        }
        const identifierSet = lastMessageListenerInfo.messageIdentifier != null
        const isSameIdentifier = message.message_send_identifier == lastMessageListenerInfo.messageIdentifier;
        const urlSet = lastMessageListenerInfo.listenerURL != null;


        const condition = identifierSet && isSameIdentifier && urlSet && isBot();
        // console.log("Failed", condition)
        if(!condition) {
            return;
        }
        const url = lastMessageListenerInfo.listenerURL;
        if(!url) {
            return;
        }
        const evtSource = new EventSource(url);
        // console.log("Created", evtSource)
        eventSourceHolder?.registerEventSource(getIdentifier(), evtSource)
        // console.log("Info", lastMessageListenerInfo.listenerURL)
        evtSource.onmessage = (event) => {
            const data = event.data
            // console.log("Stream data", data);
            if (data === '[END]') {
                // Request is closed by our servers once `[END]` is sent,
                // you must close the request otherwise the browser will keep retrying the URL.
                cleanupEventSource();
                setWaitingForBot(false);
            } else if (data !== '[START]') {
                let newMessage = eventSourceHolder.newMessageReceived(getIdentifier(), JSON.parse(data).chunk)
                setMessageToRender(newMessage);
            }
        }

    }

    const isBot = () => {
        return message.machine == true
    }

    const getImage = () => {
        if(isBot()) {
            return <svg data-v-d6619266="" width="2.5rem" aria-hidden="true" viewBox="0 0 95.82 76.19" xmlns="http://www.w3.org/2000/svg">
                <path d="M78.27,2.13h0a129.38,129.38,0,0,0-46.76,0c-1.32.24-19.44,6.65-19.44,6.65h0A18,18,0,0,0,0,25.77v12A18,18,0,0,0,10.82,54.2l44.07,22V59.77a130.25,130.25,0,0,0,23.38-2.12h0A21.42,21.42,0,0,0,95.82,36.58V23.19A21.42,21.42,0,0,0,78.27,2.13Z" fill="#2a48df"/>
                <path d="M54.89,50.76a121.11,121.11,0,0,1-21.75-2A12.4,12.4,0,0,1,23,36.58V23.19A12.39,12.39,0,0,1,33.14,11a120.45,120.45,0,0,1,43.5,0A12.39,12.39,0,0,1,86.8,23.19V36.58a12.4,12.4,0,0,1-10.16,12.2A121.11,121.11,0,0,1,54.89,50.76Z" fill="#fff"/>
                <path d="M41.31,38.86a3.75,3.75,0,0,1-3.75-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,41.31,38.86Z" fill="#6d93f6"/>
                <path d="M68.41,38.86a3.75,3.75,0,0,1-3.76-3.75V24.67a3.76,3.76,0,1,1,7.51,0V35.11A3.75,3.75,0,0,1,68.41,38.86Z" fill="#6d93f6"/>
            </svg>
        }
        return <img className="rounded-full w-10 h-10" alt="You"
                    src="/team-placeholder.png" />
    }

    const getName = () => {
        if(isBot()) {
            return "Bot"
        }
        return "You"
    }

    const getPositioning = () => {
        if(isBot()) {
            return "flex items-center flex-row-reverse mb-4"
        }
        return "flex items-center mb-4"
    }

    const getColor = () => {
        if(isBot()) {
            return "bg-pink-200"
        }
        return "bg-indigo-200"
    }

    const caretPositioning = () => {
        if(isBot()) {
            return `absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 ${getColor()}`;
        }
        return `absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 ${getColor()}`
    }

    const imageClass = () => {
        if(isBot()) {
            return "flex-none flex flex-col items-center space-y-1 ml-4";
        }
        else {
            return "flex-none flex flex-col items-center space-y-1 mr-4"
        }
    }

    const getDate = () => {
        if(message.created_at) {
            return (new Date(message.created_at * 1000)).toISOString();
        }
        return "";
    }

    const showTyping = () => {
        return isBot() && waitingForBot
    }

    return <div className={getPositioning()}>
        <div className={imageClass()}>
            {getImage()}
            <span className="block text-xs">{getName()}</span>
        </div>
        <div className={`flex-1 ${getColor()} text-gray-800 p-2 rounded-lg mb-2 relative`}>
            <div>
                <div>
                    {messageToRender}
                </div>
                <div className='flex my-1 justify-between items-center'>
                    <div>{showTyping() && <div className="dot-elastic"></div>}</div>
                    <div className='text-xs'>{getDate()}</div>
                </div>
            </div>
            <div className={caretPositioning()}></div>
        </div>
    </div>
}


type ChatMessageItemProps = {
    message: BotMessage,
    botStreamLink?: string | null,
    messageListenerInfo: BotListenerInformation | null
}
