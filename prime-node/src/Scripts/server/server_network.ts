import Networking from "../shared/networking.ts";

export default class ServerNetwork extends Networking {
    constructor(baseURL: string) {
        super(baseURL);
    }

    async responseIsValid(response: Response): Promise<Response> {
        if(response.status >= 200 && response.status < 300) {
            return response;
        }
        const content = await response.json()
        if(content && content.message) {
            throw new Error(content.message);
        }
        throw new Error("An unknown error has occurred");
    }
}

export function buildResponseWithData(data: any): Response {
    return new Response(JSON.stringify(data));
}

export function buildResponseError(message: string, statusCode: number = 400): Response {
    return new Response(JSON.stringify({error_message: message}), {status: statusCode});
}
