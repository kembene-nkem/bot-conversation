
export type CurrentPlayingInfo = {
    trackId: number,
    artistId: number,
    albumId: number,
    currentTrack: string,
    artistName: string,
    albumName: string,
    lastChatTopic?: string | null
}

export type AstroData = {
    request: Request,
    params: any
}
