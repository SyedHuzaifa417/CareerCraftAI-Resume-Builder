import { Loader2 } from "lucide-react";

export default function Loading() {
  return <Loader2 className="mx-auto my-6 animate-spin" />;
}
// somehow it fixed the hydration error stated below , so this can be something to try in such error case

// Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used
// - A server/client branch if (typeof window !== 'undefined'). - Variable input such as Date.now() or Math.random() which changes each time it's called. - Date formatting in a user's locale which doesn't match the server. - External changing data without sending a snapshot of it along with the HTML. - Invalid HTML tag nesting. It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
// See more info here: https://nextjs.org/docs/messages/react-hydration-error
