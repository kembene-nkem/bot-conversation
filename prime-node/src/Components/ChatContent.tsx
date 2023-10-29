import type {BotListenerInformation, BotMessage} from "../Scripts/shared/types.ts";
import {useEffect, useState} from "react";
import ChatMessageItem from "./ChatMessageItem.tsx";

export default function ChatContent(props: ChatContentProps) {
    const [messageList, setMessageList] = useState<BotMessage[]>([]);
    const [lastMessageListenerInfo, setLastMessageListenerInfo] = useState<BotListenerInformation | null>(null);

    useEffect(() => {
        setMessageList(props.messages);
    }, [props.messages]);

    useEffect(() => {
        if(props.messageListenerInfo) {
            setLastMessageListenerInfo(props.messageListenerInfo)
        }
    }, [props.messageListenerInfo])

    const renderMessages = () => {
        const newList: any[] = [];
        // for(let i = messageList.length - 1; i >= 0; i--) {
        //     const item = messageList[i];
        messageList.forEach((item) => {
            newList.push(<ChatMessageItem message={item} key={item.id} messageListenerInfo={lastMessageListenerInfo}/>)
        })
        return newList;
    }

    return <div className="flex flex-col px-4 py-1">
        <div className="message-holder">
            {renderMessages()}
        </div>

    </div>
}

type ChatContentProps = {
    messages: BotMessage[],
    messageListenerInfo: BotListenerInformation | null,
    // conversation_id: string | null
}
