import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import clsx from "clsx";

interface Message {
  sender: "user" | "ai";
  text: string;
  movies?: {
    id: number;
    title: string;
    poster_path: string;
    rating: number;
  }[];
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "¡Hola! 🎬 ¿Qué tipo de películas te gustaría que te recomiende hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simular respuesta IA (esto luego se reemplaza con fetch)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Aquí tienes algunas películas similares a "${input.trim()}"`,
          movies: [
            {
              id: 1,
              title: "Inception",
              poster_path: "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
              rating: 8.8,
            },
            {
              id: 2,
              title: "Tenet",
              poster_path: "/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
              rating: 7.3,
            },
          ],
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-2xl shadow-lg bg-background p-4 overflow-hidden">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx("flex", {
              "justify-end": msg.sender === "user",
              "justify-start": msg.sender === "ai",
            })}
          >
            <div
              className={clsx(
                "rounded-xl p-3 max-w-[80%] text-sm whitespace-pre-wrap",
                {
                  "bg-primary text-primary-foreground": msg.sender === "user",
                  "bg-muted text-muted-foreground": msg.sender === "ai",
                }
              )}
            >
              {msg.text}

              {msg.movies && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {msg.movies.map((movie) => (
                    <Card key={movie.id} className="p-0">
                      <CardContent className="p-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          className="rounded-lg w-full object-cover mb-2"
                        />
                        <p className="text-sm font-medium">{movie.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ⭐ {movie.rating}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
