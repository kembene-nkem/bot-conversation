export type BotInfo = {
    id: string,
    name: string
}

export type BotConversation = {
    id: string,
    name: string,
    bot_id: string,
    created_at: number
}

export type BotMessage = {
    id?: string,
    content?: string,
    conversation_id?: string,
    machine?: boolean,
    failed_responding?: boolean,
    flagged?: boolean,
    created_at?: number,
    sources?: BotMessageSource,
    message_send_identifier?: string
    bot_id?: string,
}

export type BotMessageSource = {
    data: BotDocument
}

export type BotDocument = {
    type: string,
    document_id: string,
    document_name:  string,
    document_url: string,
    created_at: number
}

export type BotListenerInformation = {
    messageIdentifier?: string,
    listenerURL?: string,
    conversationInfo?: BotConversation | null
}

export type BotPagination = {
    count: number,
    total: number,
    per_page: number,
    total_pages: number,
    next_page: number,
    current_page: number,
    previous_page: number
    links?: BotLinks | null
}

export type BotLinks = {
    next: string,
    previous: string
}

export type BotMeta = {
    pagination: BotPagination | null
}

export type AppResponseToClient<T> = {
    data: T
    meta?: BotMeta | null
    for_bot_id?: string | null,
    conversion_id?: string | null
}
