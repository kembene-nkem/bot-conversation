import Networking from "../shared/networking.ts";


class NetworkFrontEnd extends Networking{

    constructor() {
        super("/chat")
    }

    async responseIsValid(response: Response): Promise<Response> {
        if(response.status >= 200 && response.status < 300) {
            return response;
        }
        const content = await response.json()
        if(content && content.error_message) {
            throw new Error(content.error_message);
        }
        throw new Error("An unknown error has occurred");
    }
}

export const networking = new NetworkFrontEnd();
