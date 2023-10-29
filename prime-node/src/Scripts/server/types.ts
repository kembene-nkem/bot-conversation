export type CodyBot = {
    id: string,
    name: string,
    created_at: number
}

export type CodyConversation = {
    id: string,
    name: string,
    bot_id: string,
    created_at: number
}

export type CodyMessage = {
    id: string,
    content: string,
    conversation_id: string,
    machine: boolean,
    failed_responding: boolean,
    flagged: boolean,
    created_at: number,
    sources: CodyMessageSource
}

export type CodyMessageSource = {
    data: CodyDocument
}

export type CodyDocument = {
    type: string,
    document_id: string,
    document_name:  string,
    document_url: string,
    created_at: number
}

export type CodyPagination = {
    count: number,
    total: number,
    per_page: number,
    total_pages: number,
    next_page: number,
    previous_page: number
}

export type CodyMeta = {
    pagination: CodyPagination | null
}

/**** RESPONSES ***** */

export type GetBotsResponse = {
    data: CodyBot[],
    meta: CodyMeta
}

export type GetBotConversationResponse = {
    data: CodyConversation[],
    meta: CodyMeta
}

export type GetBotConversationItem = {
    data: CodyConversation
}

export type GetBotMessageResponse = {
    data: CodyMessage[],
    meta: CodyMeta
}

export type PostBotMessageForStreamResponse = {
    data: PostBotMessageForStream,
    meta: CodyMeta
}

export type PostBotMessageForStream = {
    stream_url: string
}
