import { data, Form, useFetcher } from "react-router";
import type { Route } from "./+types/chatroom";
import RecipeIdeaCard from "../components/RecipeIdeaCard";
import { generateRecipeIdea } from "../services/generateRecipeIdea";
import { generateMessages } from "../services/generateMessages";
import { useState, useEffect } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { CiSaveDown2 } from "react-icons/ci";
import Navbar from "~/navigation/navbar";
import { saveRecipe } from "../services/generateRecipeIdea";
import { loader } from "../services/chatroom.server"; // Import loader from server-side file
import ReactMarkdown from "react-markdown";
import TypingIndicator from "~/components/TypingIndicator";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Recipe chat" }];
}

export { loader }; // Export loader

export default function Chatroom({ loaderData }: Route.ComponentProps) {
    const fetcher = useFetcher();
    const [chatLog, setChatLog] = useState<{ user: string; bot?: any }[]>([]);
    const [message, setMessage] = useState("");
    const authUserId = loaderData.authUserId;

    // Load previous chat history from sessionStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedChat = sessionStorage.getItem("chatLog");
            if (storedChat) {
                setChatLog(JSON.parse(storedChat));
            }
        }
    }, []);

    // Update chat history when a new recipe is generated
    useEffect(() => {
        if (fetcher.data?.recipeIdea) {
            setChatLog((prev) => [
                ...prev.slice(0, -1),
                {
                    user: prev[prev.length - 1]?.user,
                    bot: fetcher.data.recipeIdea,
                },
            ]);
        } else if (fetcher.data?.messageResponse) {
            if (fetcher.data.messageResponse.trim() !== "") {
                setChatLog((prev) => [
                    ...prev.slice(0, -1),
                    {
                        user: prev[prev.length - 1]?.user,
                        bot: fetcher.data.messageResponse,
                    },
                ]);
            }
        } else if (fetcher.data?.error) {
            setChatLog((prev) => [
                ...prev.slice(0, -1),
                {
                    user: prev[prev.length - 1]?.user,
                    bot: { error: fetcher.data.error },
                },
            ]);
        }
    }, [fetcher.data]);

    useEffect(() => {
        if (fetcher.data?.success) {
            alert(fetcher.data.message);
        }
    }, [fetcher.data]);

    // Handle form submission
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (message.trim() === "") return;

        const isRecipeRequest =
            message.toLowerCase().includes("recipe") ||
            message.toLowerCase().includes("meal idea");

        setChatLog((prev) => [
            ...prev,
            { user: message, bot: { isLoading: true } },
        ]);

        if (isRecipeRequest) {
            fetcher.submit({ intent: "generate", message }, { method: "post" });
        } else {
            fetcher.submit(
                { intent: "generateMessage", message },
                { method: "post" }
            );
        }

        setMessage("");
    }

    function handleRegenerate(lastMessage: string) {
        fetcher.submit(
            { intent: "generate", message: lastMessage },
            { method: "post" }
        );
    }

    function handleSave(recipe: any) {
        fetcher.submit(
            {
                intent: "save",
                recipe: JSON.stringify(recipe),
                user: authUserId,
            }, // Include authUserId
            { method: "post" }
        );
    }

    const formatBotResponse = (botResponse: any) => {
        return <ReactMarkdown>{botResponse}</ReactMarkdown>;
    };

    return (
        <div className="min-h-screen bg-[#F0ECE3] flex flex-col justify-start">
            <Header />
            <div className="max-w-2xl mx-auto w-full p-6 bg-[#F0ECE3] rounded-lg">
                {/* Show bison image and message when no messages are present */}
                {chatLog.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 bg-[#F7F4ED] p-4 rounded-lg h-110">
                        <img
                            src="/bison.png" // Replace with the actual path to the bison image
                            alt="Bison"
                            className="w-32 h-32 object-cover rounded-full"
                        />
                        <p className="text-center text-lg text-gray-700">
                            Ask me anything about food
                        </p>
                    </div>
                ) : (
                    // Chat log
                    <div className="bg-[#F7F4ED] p-4 rounded-lg h-110 overflow-y-auto space-y-4">
                        {chatLog.map((entry, index) => (
                            <div key={index} className="space-y-2">
                                {/* User message */}
                                <div className="text-right">
                                    <p className="inline-block bg-[#466A39] text-white rounded-lg px-3 py-2 shadow-md">
                                        {entry.user}
                                    </p>
                                </div>

                                {/* AI response */}
                                {entry.bot && (
                                    <div className="text-left">
                                        {entry.bot.isLoading ? (
                                            <TypingIndicator />
                                        ) : entry.bot.error ? (
                                            <div className="inline-block bg-red-100 text-red-700 rounded-lg px-3 py-2 shadow-md">
                                                {entry.bot.error}
                                            </div>
                                        ) : entry.bot.title ? (
                                            <div className="bg-[#e3f1e5] rounded-lg shadow-md pb-2">
                                                <RecipeIdeaCard
                                                    key={entry.bot.id}
                                                    {...entry.bot}
                                                />
                                                <div className="flex gap-3 m-2">
                                                    <button
                                                        onClick={() =>
                                                            handleRegenerate(
                                                                entry.user
                                                            )
                                                        }
                                                        className="flex items-center gap-1 bg-[#F7F4ED] text-[#466A39] px-4 py-2 rounded-lg shadow-md hover:bg-[#F0ECE3]  transition"
                                                    >
                                                        <FaArrowRotateLeft />
                                                        Regenerate
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleSave(
                                                                entry.bot
                                                            )
                                                        }
                                                        className="flex items-center gap-1 bg-[#466A39] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#3B5731] transition"
                                                    >
                                                        <CiSaveDown2
                                                            size={23}
                                                        />
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="inline-block bg-[#e3f1e5] text-green-900 rounded-lg px-3 py-2 shadow-md">
                                                {formatBotResponse(entry.bot)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Input field */}
                <fetcher.Form
                    method="post"
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 mt-4"
                >
                    <input
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about food..."
                        className="p-3 border border-gray-300 rounded-full w-full text-black bg-white shadow-sm focus:ring-[#466A39]"
                    />
                    <button
                        type="submit"
                        className="bg-[#466A39] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#3B5731] transition"
                    >
                        {fetcher.state === "idle" ? (
                            "Send"
                        ) : (
                            <span className="animate-pulse">Typing...</span>
                        )}
                    </button>
                </fetcher.Form>
            </div>
            <Navbar />
        </div>
    );
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    try {
        if (intent === "generate") {
            const message = formData.get("message") as string;

            const isRecipeRequest =
                message.toLowerCase().includes("recipe") ||
                message.toLowerCase().includes("meal idea");

            if (isRecipeRequest) {
                const recipeIdea = await generateRecipeIdea({ message });
                return Response.json({ recipeIdea });
            } else {
                const messageResponse = await generateMessages({ message });
                return Response.json({ messageResponse });
            }
        }

        if (intent === "generateMessage") {
            const message = formData.get("message") as string;
            const messageResponse = await generateMessages({ message });
            return Response.json({ messageResponse });
        }

        if (intent === "save") {
            const recipeData = JSON.parse(formData.get("recipe") as string);
            recipeData.user = formData.get("user"); // Add the user ID to the recipe data
            const result = await saveRecipe(recipeData);
            return Response.json(result);
        }

        throw new Error("Unexpected action");
    } catch (error: any) {
        // Detect 429 error from API
        if (
            error?.message?.includes("Status 429") ||
            error?.message?.includes("capacity exceeded")
        ) {
            return Response.json({
                error: "The AI service is at capacity. Please try again later.",
            });
        }
        // Generic error
        return Response.json({
            error: "An unexpected error occurred. Please try again.",
        });
    }
}
