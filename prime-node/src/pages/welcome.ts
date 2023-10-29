import type {APIRoute} from 'astro'
export const prerender = false;

export async function GET(data: AstroData) {
    const {params, request} = data;
    return {
        body: JSON.stringify({ message: `This is my static endpoint`, url: request.url }),
    };
}

type AstroData = {
    request: Request,
    params: any
}
