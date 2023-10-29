import type {BotConversation, BotInfo} from "../Scripts/shared/types.ts";
import type {CurrentPlayingInfo} from "../Scripts/shared/utils.ts";
import {useEffect, useState} from "react";

type CodyNavProps = {
    chatTopics: BotInfo[],
    selectedTopic?: BotInfo | null,
    selectedConversation?: BotConversation | null,
    children: any,
    currentPlaylist: CurrentPlayingInfo
}

export default function CodyNav(props: CodyNavProps) {

    const getTitle = () => {
        return <span>
            <div className="text-gray-500" style={{fontSize: 12, fontWeight: "bold", height: 18}}>{props.selectedTopic?.name}</div>
            <div style={{fontSize: 18}}>Chat | {props.currentPlaylist.currentTrack}</div>
            <div className="text-gray-400" style={{fontSize: 10, fontWeight: "normal", height: 18}}>{props.selectedConversation?.name}</div>
        </span>
    }

    return <>
        <nav className="navbar bg-body-tertiary fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" style={{display: 'inline-block'}}>{getTitle()}</a>
                <button  className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    {props.children}
                </div>
            </div>
        </nav>
    </>
}

