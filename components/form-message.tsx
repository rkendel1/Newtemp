import { use } from 'react';

export type Message =
  | { success: string }
  | { error: string }
  | { message: string }
  | null
  | undefined;

export function FormMessage({ message }: { message: Message | Promise<Message> }) {
  // If message is a Promise (like searchParams), resolve it using React.use()
  const resolvedMessage = message && message instanceof Promise ? use(message) : message;
  
  // If no message or undefined/null, don't render anything
  if (!resolvedMessage) return null;
  
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {resolvedMessage && 'success' in resolvedMessage && (
        <div className="text-foreground border-l-2 border-foreground px-4">
          {resolvedMessage.success}
        </div>
      )}
      {resolvedMessage && 'error' in resolvedMessage && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
          {resolvedMessage.error}
        </div>
      )}
      {resolvedMessage && 'message' in resolvedMessage && (
        <div className="text-foreground border-l-2 px-4">{resolvedMessage.message}</div>
      )}
    </div>
  );
}
