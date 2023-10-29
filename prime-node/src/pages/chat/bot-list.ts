import type {AstroData} from "../../Scripts/shared/utils.ts";
import Cody from "../../Scripts/server/Cody.ts";
import type {AppResponseToClient, BotInfo} from "../../Scripts/shared/types.ts";
import {buildResponseError, buildResponseWithData} from "../../Scripts/server/server_network.ts";

export const prerender = false;

export async function GET(data: AstroData) {
    try {
        const cody = Cody.newInstance();
        const codyResponse = await cody.getBotList();
        const response: AppResponseToClient<BotInfo[]> = {
            data: codyResponse.data,
            meta: codyResponse.meta
        }
        return buildResponseWithData(response);
    }
    catch (e: any) {
        return buildResponseError(e.message);
    }
}
