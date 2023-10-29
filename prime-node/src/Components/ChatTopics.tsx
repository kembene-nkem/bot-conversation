import {useEffect, useState} from "react";
import type {BotInfo} from "../Scripts/shared/types.ts";


export function CodyNavTopics(props: CodyNavTopicsProps) {
    const [topicList, setTopicList] = useState<BotInfo[]>([]);
    const [currentTopic, setCurrentTopic] = useState<BotInfo | null>(null)

    useEffect(() => {

        setTopicList(props.chatTopics);
        setCurrentTopic(props.currentTopic);

    }, [props.chatTopics, props.currentTopic]);

    const renderTopics = () => {
        return topicList.map((item, index) => {
            let extraClass = '';
            let extraClassOuter = ''
            if(currentTopic && currentTopic.id == item.id) {
                extraClass = 'active'
                extraClassOuter = 'bg-indigo-200';
            }
            return <li data-bs-dismiss="offcanvas" className={`nav-item px-2 hover:bg-indigo-100 cursor-pointer ${extraClassOuter}`} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }} key={index} onClick={() => onTopicSelected(item)}>
                <a className={`nav-link ${extraClass}`} aria-current="page" data-id={item.id}>{item.name}</a>
            </li>
        })
    }

    const onTopicSelected = (topic: BotInfo) => {
        if(props.onTopicSelected) {
            props.onTopicSelected(topic);
        }
    }

    return <>
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Topics</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {renderTopics()}
            </ul>
        </div>
    </>
}

type CodyNavTopicsProps = {
    chatTopics: BotInfo[],
    currentTopic: BotInfo | null
    onTopicSelected?: (topic: BotInfo) => void
}
