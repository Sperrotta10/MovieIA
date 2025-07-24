import { ChatBot } from '@/components/ChatBot'

export function Chat() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ChatBot />
      </div>
    </div>
  );
}