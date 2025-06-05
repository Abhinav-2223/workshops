"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  uid: string;
  text: string;
  sentOn: Date;
}

export default function Home() {
  // identify user by uuid
  const userId = useRef(crypto.randomUUID().toString());
  // chat messages to render
  const [messages, setMessages] = useState<Message[]>([]);
  // current user input in send input
  const [input, setInput] = useState("");

  // fetch messages on component mount & at 250ms intervals from backend
  const fetchMessages = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-cache",
        mode: "cors",
      },
    );
    setMessages(await response.json());
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 250);
    // cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // send callback
  const sendMessage = async (text: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/chat`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      mode: "cors",
      // POST request to backend
      method: "POST",
      body: JSON.stringify({
        uid: userId.current,
        text,
      }),
    });

    // user feedback on send: clear input
    setInput("");
  };

  // render chat interface
  const models = messages.map(({ uid: sentBy, text, sentOn }): MessageModel => {
    return {
      payload: text,
      direction: sentBy === userId.current ? "outgoing" : "incoming",
      sender: sentBy,
      sentTime: sentOn.toString(),
      position: "single",
    };
  });

  return (
    <div
      className={
        "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      }
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <h1 className="text-8xl text-black">💬 Chat</h1>
        <div className="text-center">Chat &amp; make friends.</div>
        <ChatContainer className="w-full">
          <MessageList
            style={{ height: "500px" }}
            autoScrollToBottomOnMount={true}
          >
            {models.map((m, i) => (
              <Message key={i} model={m as MessageModel} />
            ))}
          </MessageList>
          <MessageInput
            autoFocus
            attachButton={false}
            placeholder="Say Hi... "
            value={input}
            onChange={(innerHtml) => setInput(innerHtml)}
            onSend={sendMessage}
          />
        </ChatContainer>
      </main>
    </div>
  );
}
