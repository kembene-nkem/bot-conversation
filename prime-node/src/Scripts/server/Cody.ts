import type {
    GetBotConversationItem,
    GetBotConversationResponse,
    GetBotMessageResponse,
    GetBotsResponse, PostBotMessageForStreamResponse
} from "./types.ts";
import ServerNetwork from "./server_network.ts";
import type {BotListenerInformation, BotMessage} from "../shared/types.ts";

export default class Cody {
    network: ServerNetwork;
    constructor(apiKey: string, codyEndpoint: string) {
        this.network = new ServerNetwork(codyEndpoint);
        this.network.myHeaders.set("Authorization", `Bearer ${apiKey}`);
    }

    async getBotList(): Promise<GetBotsResponse> {
        return await this.network.getData("bots");
    }

    async getBotConversations(bot_id: string): Promise<GetBotConversationResponse> {
        return await this.network.getData("conversations?bot_id=" + bot_id)
    }

    async getBotMessages(conversation_id: string, page: number): Promise<GetBotMessageResponse> {
        return await this.network.getData("messages?conversation_id=" + conversation_id + "&page="+page)
    }

    async createConversation(bot_id: string, message?: string): Promise<GetBotConversationItem> {

        const data = {
            bot_id: bot_id,
            name: message ? message.slice(0, 15) : (new Date()).toISOString()
        }
        return await this.network.submitData("conversations", data) as GetBotConversationItem;
    }

    async postMessage(botMessage: BotMessage): Promise<BotListenerInformation> {
        let conversation_id = botMessage.conversation_id;
        const bot_id = botMessage.bot_id;
        const response: BotListenerInformation = {}
        if(!conversation_id) {
            if(bot_id == null) {
                throw new Error("Invalid request, bot_id required")
            }
            const conversation = (await this.createConversation(bot_id, botMessage.content)).data;
            response.conversationInfo = {...conversation}
            conversation_id = conversation.id
        }
        if(!conversation_id) {
            throw new Error("Invalid request, conversation_id required");
        }

        const messagePayload = {
            content: botMessage.content,
            conversation_id: conversation_id,
            redirect: false
        }

        const result = await this.network.submitData("messages/stream", messagePayload) as PostBotMessageForStreamResponse;
        response.listenerURL = result.data.stream_url
        response.messageIdentifier = botMessage.message_send_identifier;
        return response;


    }

    static newInstance(): Cody {
        return new Cody(import.meta.env.CODY_API_KEY, import.meta.env.CODY_BASE_URL ?? "https://getcody.ai/api/v1");
    }
}
