import type {BotConversation, BotInfo} from "../Scripts/shared/types.ts";
import {useEffect, useState} from "react";

export function CodyNavConversations(props: CodyNavConversationProps) {

    const [conversationList, setConversationList] = useState<BotConversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<BotConversation | null>(null);

    useEffect(() => {
        setConversationList(props.conversations);
        setCurrentConversation(props.currentConversation);

    }, [props.conversations, props.currentConversation]);

    const didClickBackButton = (e: any) => {
        if(props.backRequested) {
            props.backRequested();
        }
    }

    const didSelectConversation = (conversation: BotConversation) => {
        if(props.onConversationSelected && currentConversation?.id != conversation.id) {
            props.onConversationSelected(conversation);
        }
    }

    const renderConversations = () => {
        return conversationList.map((item, index) => {
            let name = item.name;
            if(!name) {
                name = "@ "+(new Date(item.created_at * 1000)).toDateString();
            }
            let extraClass = '';
            let extraClassOuter = ''
            if(currentConversation && currentConversation.id == item.id) {
                extraClass = 'active'
                extraClassOuter = 'bg-indigo-200';
            }
            return <li data-bs-dismiss="offcanvas" className={`nav-item px-2 hover:bg-indigo-100 cursor-pointer ${extraClassOuter}`} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }} key={index} onClick={() => didSelectConversation(item)}>
                <a className={`nav-link ${extraClass}`} aria-current="page" data-id={item.id}>{name}</a>
            </li>
        })
    }

    return <>
        <div className="offcanvas-header">
            <button type="button" className="btn-back" aria-label="Back" style={{backgroundColor: "transparent", border: 'none'}} onClick={didClickBackButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-backspace" viewBox="0 0 16 16">
                    <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/>
                    <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"/>
                </svg>
            </button>
            <h5 className="offcanvas-title text-center" id="offcanvasNavbarLabel">
                <div>Conversations</div>
                <small style={{fontSize: 12}}>{props.forTopic?.name}</small>
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {renderConversations()}
            </ul>
        </div>
    </>
}

type CodyNavConversationProps = {
    forTopic: BotInfo | null,
    conversations: BotConversation[],
    currentConversation: BotConversation | null,
    backRequested?: () => void,
    onConversationSelected?: (conversation: BotConversation) => void
}
