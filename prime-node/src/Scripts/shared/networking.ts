export default class Networking {
    myHeaders: Headers;
    baseUrl: string;

    constructor(baseURL: string) {
        this.myHeaders =  new Headers();
        this.baseUrl = baseURL;
        this.myHeaders.set("Content-Type", "application/json");

    }

    async getData<T>(path: string): Promise<T> {
        try {
            let response = await fetch(`${this.baseUrl}/${path}`, {headers: this.myHeaders});
            response = await this.responseIsValid(response);
            return await response.json() as T;
        } catch (e) {
            throw this.mapThrownError(e);
        }
    }

    async submitData<T>(path: string, data: any): Promise<T> {
        try {
            let response = await fetch(`${this.baseUrl}/${path}`, {
                method: 'POST',
                headers: this.myHeaders,
                body: JSON.stringify(data)
            });
            response = await this.responseIsValid(response);
            return await response.json() as T;
        }
        catch (e) {
            throw this.mapThrownError(e);
        }
    }

    async responseIsValid(response: Response): Promise<Response> {
        if(response.status >= 200 && response.status < 300) {
            return response;
        }
        throw new Error("Invalid status code received")
    }

    mapThrownError(error: any) {
        return error;
    }

}
