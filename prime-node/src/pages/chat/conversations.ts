import type {AstroData} from "../../Scripts/shared/utils.ts";
import Cody from "../../Scripts/server/Cody.ts";
import type {AppResponseToClient, BotConversation} from "../../Scripts/shared/types.ts";
import {buildResponseError, buildResponseWithData} from "../../Scripts/server/server_network.ts";
export const prerender = false;

export async function GET(data: AstroData) {
    try {
        const {request} = data
        const url = new URL(request.url);
        const params = url.searchParams;
        const topicId = params.get('topic')

        const cody = Cody.newInstance();
        const codyResponse = await cody.getBotConversations(topicId ?? "");
        const response: AppResponseToClient<BotConversation[]> = {
            data: codyResponse.data,
            meta: codyResponse.meta,
            for_bot_id: topicId
        }
        return buildResponseWithData(response);
    }catch (e: any) {
        return buildResponseError(e.message);
    }

}
