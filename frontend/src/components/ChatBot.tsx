import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, LucideBotMessageSquare, UserCircle2Icon } from "lucide-react";
import clsx from "clsx";
import { chatWithIA } from "@/services/chat_ia";
import { MovieCardMsg } from "@/components/NavBar/movie/MovieCardMsg"

interface Message {
  sender: "user" | "ai";
  text: string;
  id: string; // Optional ID for React key
  movies?: {
    id: number;
    title: string;
    overview: string;
    imageUrl: string;
    rating: number;
  }[];
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "¡Hola! 🎬 ¿Qué tipo de películas te gustaría que te recomiende hoy?",
      id: crypto.randomUUID()
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: "user", text: input.trim(), id: crypto.randomUUID() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    chatWithIA(input.trim()).then((response) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.text,
          id: crypto.randomUUID(),
          movies: response.movies,
        },
      ]);
    })
    .catch(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Lo siento, tuve un problema para encontrar películas en este momento. 😔",
          id: crypto.randomUUID(),
        },
      ]);
    });
  };

  return (
    <div className="w-full min-h-full bg-neon-gradient px-4 py-8">
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto border rounded-2xl shadow-2xl p-4 overflow-hidden backdrop-blur-md
            bg-white/70 dark:bg-black/60
            border-gray-300 dark:border-white/20
            shadow-gray-500/65 dark:shadow-pink-400/25">
        {/* Chat area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth">
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={clsx("flex items-end", {
                    "justify-end": msg.sender === "user",
                    "justify-start": msg.sender === "ai",
                    })}
                >
                    {msg.sender === "ai" && (
                    <span className="mr-2 flex items-center justify-center">
                        <LucideBotMessageSquare className="w-7 h-7 text-muted-foreground" />
                    </span>
                    )}
                    <div
                    className={clsx(
                        "rounded-xl p-3 max-w-[80%] text-sm whitespace-pre-wrap shadow-md",
                        {
                        "bg-white/80 text-black border border-cyan-400 shadow-cyan-400/20 dark:bg-transparent dark:text-white dark:border-cyan-400 dark:shadow-cyan-400/30": msg.sender === "user",
                        "bg-gray-100 text-pink-600 border border-pink-400 shadow-pink-300/20 dark:bg-white/10 dark:text-pink-300 dark:border-pink-500 dark:shadow-pink-400/20": msg.sender === "ai",
                        }
                    )}
                    >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {msg.movies && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        {msg.movies.map((movie) => (
                            <MovieCardMsg key={movie.id} movie={movie} />
                        ))}
                        </div>
                    )}
                    </div>
                    {msg.sender === "user" && (
                    <span className="ml-2 flex items-center justify-center">
                        <UserCircle2Icon className="w-7 h-7 text-primary" />
                    </span>
                    )}
                </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 mt-4 border-t pt-3">
                <Input
                placeholder="Escribe tu petición de películas..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                />
                <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
  );
}
