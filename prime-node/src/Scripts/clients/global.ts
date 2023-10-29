import type {CurrentPlayingInfo} from "../shared/utils.ts";
import {EventPublisher, EventTypes} from "./types.ts";
import type {PrimeEventHandler} from "./types.ts";

export class PrimeHome {

    loader: HTMLElement | null;
    currentTrackInfo: CurrentPlayingInfo | undefined;
    eventSourceHolder: EventSourceHolder
    eventPublisher: EventPublisher
    constructor() {
        this.loader = document.getElementById("page-loader");
        this.eventPublisher = new EventPublisher();
        this.addEventListener(EventTypes.PLAYLIST_INFO_LOADED, (event) => this.onPlaylistLoaded(event))
        // this.triggerEvent('PLAYLIST_INFO_LOADED', {
        //     trackId: 23,
        //     artistId: 12,
        //     albumId: 32,
        //     currentTrack: "Why Me",
        //     artistName: "This is Me",
        //     albumName: "Coming",
        //     lastChatTopic: "News"
        // });
        this.eventSourceHolder = new EventSourceHolder();
    }
    addEventListener(event: string, listener: PrimeEventHandler) {
        this.eventPublisher.addEventListener(event, listener);
    }

    removeEventListener(event: string, listener: PrimeEventHandler) {
        this.eventPublisher.removeEventListener(event, listener);
    }

    triggerEvent(event: string, data: any) {
        this.eventPublisher.triggerEvent(event, data)
    }

    showLoader() {
        if(this.loader) {
            this.loader.style.display = "block";
        }
    }

    hideLoader() {
        if(this.loader) {
            this.loader.style.display = "none";
        }
    }

    onPlaylistLoaded(event: Event) {
        this.currentTrackInfo = (event as CustomEvent).detail;
        this.hideLoader();
        this.triggerEvent(EventTypes.PLAYLIST_INFO_READY, {...this.currentTrackInfo});
    }

    getEventSourceHolder(): EventSourceHolder {
        return this.eventSourceHolder;
    }

    postMessageToHost(event: string, data: any) {
        const item = {
            event: event,
            data: data
        }
        const appWindow = window as any;
        if(appWindow.webkit) {
            appWindow.webkit.messageHandlers?.botHandler?.postMessage(item)
        }
    }

    showAlert(message: string, type: string) {
        const appWindow = window as any;
        if(appWindow) {
            const tag = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
            let element = document.getElementById('alert-holder');
            if(element) {
                element.innerHTML = tag;
            }
        }
    }

}

class EventSourceHolder {
    eventSources: {[key: string]: EventSourceInformation};

    constructor() {
        this.eventSources = {}
    }

    registerEventSource(key: string, source: EventSource) {
        const current = this.eventSources[key];
        if(current) {
            current.eventSource.close();
            current.eventSource = source;
            current.isClosed = false;
        }
        else {
            this.eventSources[key] = {
                eventSource: source,
                message: "",
                isClosed: false
            }
        }
    }

    closeEventSource(key: string) {
        const current = this.eventSources[key];
        if(current) {
            current.eventSource.close();
            current.isClosed = true;
        }
    }

    newMessageReceived(key: string, newMessage: string): string {
        const current = this.eventSources[key];
        let message = newMessage;
        if(current) {
            message = current.message + message
            current.message = message;
        }
        return message;
    }

}

type EventSourceInformation = {
    eventSource: EventSource;
    message: string;
    isClosed: boolean;
}

export function getPrimeHome(): PrimeHome {
    if(window) {
        const appWindow = window as any;
        if(appWindow.$prime) {
            return appWindow.$prime;
        }
        const prime = new PrimeHome();
        appWindow.$prime = prime;
        return prime;
    }
    return new PrimeHome();
}
