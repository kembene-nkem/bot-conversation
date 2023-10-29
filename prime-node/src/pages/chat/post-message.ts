import type {AstroData} from "../../Scripts/shared/utils.ts";
import Cody from "../../Scripts/server/Cody.ts";
import {buildResponseError, buildResponseWithData} from "../../Scripts/server/server_network.ts";
import type {AppResponseToClient, BotListenerInformation, BotMessage} from "../../Scripts/shared/types.ts";

export const prerender = false;

export async function POST(data: AstroData) {
    try {
        const {request} = data

        const body = await request.json() as BotMessage

        const cody = Cody.newInstance();
        const codyResponse = await cody.postMessage(body);
        const response: AppResponseToClient<BotListenerInformation> = {
            data: codyResponse
        }
        return buildResponseWithData(response);
    }catch (e: any) {
        return buildResponseError(e.message);
    }
}
