import type {
    AppResponseToClient,
    BotConversation,
    BotInfo,
    BotListenerInformation,
    BotMessage,
    BotPagination
} from "../Scripts/shared/types.ts";
import {useEffect, useRef, useState} from "react";
import {getPrimeHome, PrimeHome} from "../Scripts/clients/global.ts";
import type {CurrentPlayingInfo} from "../Scripts/shared/utils.ts";
import CodyNav from "./CodyNav.tsx";
import ChatContent from "./ChatContent.tsx";
import ChatInput from "./ChatInput.tsx";
import {CodyNavTopics} from "./ChatTopics.tsx";
import {CodyNavConversations} from "./ChatConversation.tsx";
import {networking} from "../Scripts/clients/network.ts";
import {BotMessageEventType, EventTypes} from "../Scripts/clients/types.ts";

export const prerender = false;

type CodyChatProps = {

}
export default function CodyChat (props: CodyChatProps) {

    const bottomRef = useRef(null);
    const scrollContainer = useRef<any>(null);
    const [playlistData, setPlayListData] = useState<CurrentPlayingInfo|null>(null);
    const [botList, setBotList] = useState<BotInfo[]>([]);
    const [conversationList, setConversationList] = useState<BotConversation[]>([]);
    const [messages, setMessages] = useState<BotMessage[]>([]);
    const [currentTopic, setCurrentTopic] = useState<BotInfo | null>(null);
    const [currentConversation, setCurrentConversation] = useState<BotConversation | null>(null);
    const [lastBotListener, setLastBotListener] = useState<BotListenerInformation | null>(null);
    const [loading, setLoading] = useState(true);
    const [navRenderMode, setNavRenderMode] = useState('topics');
    const [prime, setPrime] = useState<PrimeHome | null>(null);
    const [hasSentInitialMessage, setHasSentInitialMessage] = useState(false);

    const [messagePagination, setMessagePagination] = useState<BotPagination | null | undefined>(null);

    useEffect(()  => {
        setPrime(getPrimeHome());
        subscribeToEvents();
    }, []);

    useEffect(() => {
        if(playlistData != null) {
            initializeCody()
        }
    }, [playlistData]);

    useEffect(() => {
        if(!prime) {
            return;
        }
        if(loading) {
            prime.showLoader();
        }
        else {
            prime.hideLoader();
        }
    }, [loading]);

    useEffect(() => {
        onCurrentTopicDidChange();
    }, [currentTopic]);

    useEffect(() => {
        onCurrentConversationDidChange();
    }, [currentConversation]);

    const subscribeToEvents = () => {
        let primeHome = getPrimeHome();
        primeHome.addEventListener(EventTypes.PLAYLIST_INFO_READY, (e) => playlistLoadedSuccessfully(e as CustomEvent));
        if(primeHome.currentTrackInfo) {
            didUpdateCurrentTrackerInfo(primeHome.currentTrackInfo);
        }
    };

    const playlistLoadedSuccessfully = (event: CustomEvent) => {
        didUpdateCurrentTrackerInfo(event.detail);
    }

    const didUpdateCurrentTrackerInfo = (info: CurrentPlayingInfo) => {
        setPlayListData(info);
    }

    const onCurrentTopicDidChange = () => {
        if(currentTopic == null) {
            return;
        }

        prime?.postMessageToHost("TOPIC_SELECTED", currentTopic);
        setNavRenderMode("conversations");
        loadConversationsForTopic(currentTopic)
            .then((conversations) => {
                if(conversations.length > 0) {
                    setCurrentConversation(conversations[0]);
                }
                else {
                    setCurrentConversation(null);
                    attemptToStartFirstConversation();
                }
            })
            .catch(error => {})
    }

    const attemptToStartFirstConversation = () => {
        if(hasSentInitialMessage) {
            return;
        }
        setHasSentInitialMessage(true);
        let message: string = "";
        if(playlistData?.lastChatTopic == "Jokes") {
            message = "Tell me a joke, ideally related to a member of @artist and their song @track"
        }
        else if(playlistData?.lastChatTopic == "News") {
            message = "Provide recent news, focusing on a member of @artist and their song @track"
        }
        else if(playlistData?.lastChatTopic == "Stories") {
            message = "Narrate a story, preferably about a member of @artist and the inception of their song @track."
        }
        if(message.length > 0) {
            didProvideMessageForSending(message);
        }
    }

    const onCurrentConversationDidChange = () => {
        updateMessages([], BotMessageEventType.refreshEvents);
        if(currentConversation == null) {
            return;
        }
        loadMessagesForConversation(currentConversation.id)
            .then((messages) => {
                if(messages.length == 0 && (messagePagination?.current_page ?? 1) == 1) {
                    attemptToStartFirstConversation();
                }
            })
            .catch(error => {})
    }

    const initializeCody = () => {
        loadCodyBots()
            .then((bots) => {
                afterInitialBotsLoaded(bots);
            })
            .catch((error) => {
                prime?.showAlert(error.message, 'danger');
            })
    }

    const loadCodyBots = async (): Promise<BotInfo[]> => {
        setLoading(true);
        try {
            const list: AppResponseToClient<BotInfo[]> = await networking.getData("bot-list");
            // const list: AppResponseToClient<BotInfo[]> = JSON.parse('{"data":[{"id":"joQeZ8KY6bpZ","name":"News","description":"Artist News","model":"gpt-3.5-turbo","created_at":1698400710},{"id":"mWZdPjwZnaKg","name":"Jokes","description":"Provides jokes about artists","model":"gpt-3.5-turbo","created_at":1698400485},{"id":"QK9b6WpvndEv","name":"Stories","description":"Only generates responses based on what it can find in its knowledge base.","model":"gpt-3.5-turbo","created_at":1698325152},{"id":"O5xe79qwjb7r","name":"Creative Cody","description":"Can do creative work like generating ads and slogans.","model":"gpt-3.5-turbo","created_at":1698325152}],"meta":{"pagination":{"total":4,"count":4,"per_page":15,"current_page":1,"total_pages":1,"links":{}}}}');
            const data = [...list.data];
            setBotList(data);
            // console.log("Topics:", JSON.stringify(list));
            setLoading(false);
            return data;
        }catch (e) {
            setLoading(false);
            throw e;
        }

    }

    const loadConversationsForTopic = async (topic: BotInfo): Promise<BotConversation[]> => {
        setLoading(true);
        try {
            const list: AppResponseToClient<BotConversation[]> = await networking.getData('conversations?topic='+topic.id);
            // const list: AppResponseToClient<BotConversation[]> = JSON.parse('{"data":[{"id":"OpnelpQ7geKB","name":null,"bot_id":"mWZdPjwZnaKg","created_at":1698416526},{"id":"k8mepzw2VbMy","name":"Jazz Jokes and Sample Artists","bot_id":"mWZdPjwZnaKg","created_at":1698416424}],"meta":{"pagination":{"total":2,"count":2,"per_page":15,"current_page":1,"total_pages":1,"links":{}}}}');
            const data = [...list.data];
            setConversationList(data);
            // console.log("Conversations:", JSON.stringify(list))
            setLoading(false);
            return data;
        }
        catch (e) {
            setLoading(false);
            throw e;
        }
    }

    const loadMessagesForConversation = async (conversation_id: string, page: number = 1, append: boolean = false): Promise<BotMessage[]> => {
        setLoading(true);
        try {
            const list: AppResponseToClient<BotMessage[]> = await networking.getData('messages?conversation='+conversation_id + "&page="+page);
            // const list: AppResponseToClient<BotMessage[]> = JSON.parse('{"data":[{"id":"WZdPNW6r6aKg","content":"You\'re welcome! If you have any more questions or need assistance in the future, feel free to ask. Have a great day!","machine":true,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698492905},{"id":"3YaOY6JqEdxq","content":"okay, thanks","machine":false,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698492904},{"id":"4zbqxLAZDapr","content":"Goodbye! Take care and farewell!","machine":true,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491562},{"id":"8mepYL92XaMy","content":"Bye","machine":false,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491561},{"id":"MvbmZN7yEdYA","content":"Goodbye! Take care and have a wonderful day!","machine":true,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491530},{"id":"pnelYE877aKB","content":"Bye","machine":false,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491529},{"id":"WPe9rY3g8aLy","content":"You\'re welcome! If you have any more questions in the future, don\'t hesitate to ask. Have a great day!","machine":true,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491483},{"id":"Vyb82KXE2evA","content":"Okay thanks","machine":false,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491482},{"id":"J0dNkW7YmeLO","content":"Thank you! I\'m glad you found the information helpful. If you have any more questions or if there\'s anything else I can assist you with, please feel free to let me know.","machine":true,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491334},{"id":"N1aM8W7JPeWm","content":"that\'s nice","machine":false,"failed_responding":false,"flagged":false,"conversation_id":"OpnelpQ7geKB","created_at":1698491333}],"meta":{"pagination":{"total":24,"count":10,"per_page":10,"current_page":1,"total_pages":3,"links":{"next":"https://getcody.ai/api/v1/messages?page=2"}}},"conversion_id":"OpnelpQ7geKB"}');
            let data =  [...list.data];

            if(list.conversion_id && list.conversion_id == currentConversation?.id) {
                setMessagePagination(list.meta?.pagination)
            }
            setLoading(false);
            if(page == 1) {
                updateMessages(data, BotMessageEventType.refreshEvents);
            }
            else {
                updateMessages(data, BotMessageEventType.oldEventsLoaded);
            }

            return data;
        }
        catch (e) {
            setLoading(false);
            throw e;
        }
    }

    const didProvideMessageForSending = (message: string) => {
        const currentDate = (new Date()).getTime() / 1000
        const identifier = `${currentDate}-initial`;
        const artist = playlistData?.artistName ?? "";
        const track = playlistData?.currentTrack ?? "";
        const album = playlistData?.albumName ?? "";

        message = message
            .replaceAll("@artist", `"${artist}"`)
            .replaceAll("@track", `"${track}"`)
            .replaceAll("@album", `"${album}"`)
        const messageToSend: BotMessage = {
            content: message,
            conversation_id: currentConversation?.id,
            id: `${currentDate}`,
            message_send_identifier: identifier,
            machine: false,
            created_at: currentDate,
            bot_id: currentTopic?.id
        }

        const machineMessage: BotMessage = {
            id: `${currentDate + 1}`,
            message_send_identifier: identifier,
            created_at: currentDate,
            machine: true
        }

        const newMessages = [messageToSend, machineMessage];
        updateMessages(newMessages, BotMessageEventType.newEventsLoaded);
        sendMessage(messageToSend)
            .then(() => {})
            .catch(() => {});
    }

    const sendMessage = async (message: BotMessage) => {
        const response: AppResponseToClient<BotListenerInformation> = await networking.submitData("post-message", message);
        const data = response.data;
        if(data.conversationInfo != null) {
            // a new conversation was created
            const newList = [...conversationList];
            newList.push(data.conversationInfo);
            setConversationList(newList);
            setCurrentConversation(data.conversationInfo);
        }
        setLastBotListener(data);

    }

    const afterInitialBotsLoaded =  (loadedBots: BotInfo[]) => {
        const topic = playlistData?.lastChatTopic ?? ''
        if(topic == '') {
            return;
        }
        const topicToLoad = loadedBots.filter((topicItem) => topicItem.name == topic)
        if(topicToLoad && topicToLoad.length > 0) {
            onTopicSelected(topicToLoad[0])
        }
        else if(loadedBots.length > 0) {
            // todo display a message then load the first topic
            onTopicSelected(loadedBots[0]);
        }
    }

    const renderEmptyState = () => {
        return "Empty";
    }

    const onTopicSelected = (bot: BotInfo) => {
        setCurrentTopic({...bot})
    }

    const goBackToTopics = () => {
        setNavRenderMode("topics");
        setConversationList([]);
        // setCurrentConversation(null);
    }

    const onConversationSelected = (conversation: BotConversation) => {
        // fetch the messages from that conversation
        setCurrentConversation({...conversation});
    }

    const enableTextField = (): boolean => {
        return currentTopic != null;
    }

    const getNavView = () => {
        if(navRenderMode == 'topics') {
            return <CodyNavTopics chatTopics={botList} currentTopic={currentTopic} onTopicSelected={onTopicSelected}/>
        }
        return <CodyNavConversations conversations={conversationList} backRequested={goBackToTopics} forTopic={currentTopic}
                                     onConversationSelected={onConversationSelected} currentConversation={currentConversation}/>
    }

    const renderContent = () => {
        if(playlistData == null) {
            return renderEmptyState();
        }
        return returnMainContent(playlistData);
    }

    const updateMessages = (messageList: BotMessage[], eventType: BotMessageEventType) => {
        const container: any | null = scrollContainer.current;

        let newMessages: BotMessage[] = [];
        if(eventType === BotMessageEventType.refreshEvents) {
            messageList.forEach(item => newMessages.unshift(item))
        }
        else if(eventType == BotMessageEventType.oldEventsLoaded) {
            newMessages = [...messages];
            messageList.forEach(item => newMessages.unshift(item))
        }
        else if(eventType == BotMessageEventType.newEventsLoaded) {
            newMessages = [...messages];
            messageList.forEach(item => newMessages.push(item));
        }

        if(container != null && eventType == BotMessageEventType.oldEventsLoaded) {
            container.scrollTop = 5;
        }
        setMessages(newMessages);

        setTimeout(() => {
            if(eventType != BotMessageEventType.oldEventsLoaded) {
                scroll();
            }
        }, 200);

    }

    const scroll = () => {
        const element: any | null = bottomRef.current;
        element?.scrollIntoView({behavior: 'smooth'});
    }

    const didScroll = (event: any) => {
        const conversationId = currentConversation?.id
        const shouldLoadMore = event.target.scrollTop == 0 && messagePagination && conversationId != null;
        if(!shouldLoadMore) {
            return;
        }
        const next = messagePagination.links?.next;
        if(!next) {
            return;
        }
        const url = new URL(next);
        const params = url.searchParams;
        const nextPage = parseInt(params.get('page') ?? "");
        if(!isNaN(nextPage)) {
            loadMessagesForConversation(conversationId, nextPage, true)
                .then(() => {}).catch(() => {})

        }
    }

    const returnMainContent = (info: CurrentPlayingInfo) => {
        return <div className="h-screen">
            <CodyNav chatTopics={botList} currentPlaylist={info} selectedTopic={currentTopic} selectedConversation={currentConversation}>
                {getNavView()}
            </CodyNav>
            <div className="flex flex-col h-full" style={{paddingTop: 100}}>
                <div className="flex-1 overflow-y-auto" onScroll={didScroll} ref={scrollContainer}>
                    <ChatContent messageListenerInfo={lastBotListener} messages={messages}/>
                    <div ref={bottomRef} />
                </div>
                <div className="justify-self-end">
                    <ChatInput enableForInput={enableTextField()} didTypeMessageCallback={didProvideMessageForSending} />
                </div>
            </div>
        </div>
    }

    return <>
        {renderContent()}
    </>
}
