import {useEffect, useRef, useState} from 'react';
import type {PrimeHome} from "../Scripts/clients/global.ts";
import {getPrimeHome} from "../Scripts/clients/global.ts";
import {info} from "sass";

export default function ChatInput(props: ChatInputProps) {

    const [prime, setPrime] = useState<PrimeHome | null>(null);
    const inputRef = useRef(null);
    const [hasText, setHasText] = useState(false);
    const [textFieldStyle, setTextFieldStyle] = useState<any>({
        height: 56, overflow: 'hidden', maxHeight: 200, paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '0.8rem', paddingRight: '0.8rem', border: 'none', resize: 'none'
    })

    useEffect(() => {
        setPrime(getPrimeHome);
    }, []);

    const getLineCount = (text: string) => {
        if (!text) {
            return 0;
        }
        return text.split(/\n/).length;
    }

    const enableButton = () => {
        return props.enableForInput && hasText;
    }

    const getEnteredText = (): string | null => {
        const input: any = inputRef.current;
        if(input) {
            const value =  input.value;
            if(value.trim().length > 0) {
                return value;
            }
        }
        return null
    }

    const removeText = () => {
        const input: any = inputRef.current;
        if(input) {
            input.value = "";
        }
        setHasText(false);
    }

    const onTextChanged = (e: any) => {
        const text = getEnteredText();
        if(text != null) {
            const update = {...textFieldStyle};
            const lines = getLineCount(text);
            setHasText(true);
            update.height = lines * 56;
            if(lines <= 1){
                update.overflow = "hidden";
            }
            else{
                update.overflow = "auto";
            }
            setTextFieldStyle(update);
        }
        else {
            setHasText(false);
        }
    }

    const sendMessage = () => {
        const text = getEnteredText();
        if(props.didTypeMessageCallback && text != null) {
            props.didTypeMessageCallback(text);
        }
        removeText()
    }

    const showInfo = () => {
        const content = `<div>
            <strong>Token Replacements</strong>
            <br/>
            You can use the following token in your message
            <br/>
            <div><small><strong>@track</strong>: The name of the currently playing track</small></div>
            <div><small><strong>@artist</strong>: Name of artist for the currently playing track</small></div>
            <div><small><strong>@album</strong>: The album for the currently playing track</small></div>
        </div>`
        prime?.showAlert(content, 'info');
    }

    return <div className="p-3">
        <div className="flex flex-row items-center rounded-xl bg-white w-full p-1">
            <div className="p-1">
                <span onClick={showInfo}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333333" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                </span>
            </div>
            <div className="relative w-full">
                <div className="" style={{marginRight: 55}}>
                    <textarea placeholder="Type to chat" ref={inputRef} rows={1} className="w-full no-highlight" style={{...textFieldStyle}} onChange={onTextChanged} disabled={!props.enableForInput}/>
                </div>
                <button className="bg-indigo-500 text-center rounded-xl text-white px-3 py-1 flex-shrink-0 border-0 absolute right-1 bottom-2" onClick={sendMessage} style={{lineHeight: 2, opacity: hasText ? 1 : 0.4}} disabled={!enableButton()}>
                    <span>
                        <svg
                            className="w-4 h-4 transform rotate-45 -mt-px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </span>
                </button>
            </div>

        </div>
    </div>
}

type ChatInputProps = {
    enableForInput: boolean,
    didTypeMessageCallback?: (message: string) => void
}
//max-height: 200px; height: 56px; overflow-y: hidden;
//flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10
