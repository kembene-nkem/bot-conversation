export type PrimeEventHandler = (event: Event) => void

export const EventTypes = {
    PLAYLIST_INFO_LOADED: "PLAYLIST_INFO_LOADED",
    PLAYLIST_INFO_READY: "PLAYLIST_INFO_READY"
}

export class EventPublisher {
    addEventListener(event: string, listener: PrimeEventHandler) {
        document.addEventListener(event, listener)
    }

    removeEventListener(event: string, listener: PrimeEventHandler) {
        document.removeEventListener(event, listener);
    }

    triggerEvent(event: string, data: any) {
        const eventObject = new CustomEvent(event, {detail: data});
        document.dispatchEvent(eventObject);
    }
}

export enum BotMessageEventType {
    refreshEvents,
    newEventsLoaded,
    oldEventsLoaded

}
