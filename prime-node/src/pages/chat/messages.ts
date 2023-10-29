import type {AstroData} from "../../Scripts/shared/utils.ts";
import Cody from "../../Scripts/server/Cody.ts";
import type {AppResponseToClient, BotMessage} from "../../Scripts/shared/types.ts";
import {buildResponseError, buildResponseWithData} from "../../Scripts/server/server_network.ts";
export const prerender = false;

export async function GET(data: AstroData) {

    try {
        const {request} = data
        const url = new URL(request.url);
        const params = url.searchParams;
        const conversationId = params.get('conversation');

        let page = parseInt(params.get('page') ?? "1");
        if (isNaN(page)) {
            page = 1
        }


        const cody = Cody.newInstance();
        const codyResponse = await cody.getBotMessages(conversationId ?? "", page);
        const response: AppResponseToClient<BotMessage[]> = {
            data: codyResponse.data,
            meta: codyResponse.meta,
            conversion_id: conversationId
        }
        return buildResponseWithData(response);
    } catch (e: any) {
        return buildResponseError(e.message);
    }
}
