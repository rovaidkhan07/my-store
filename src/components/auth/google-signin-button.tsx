"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number | string;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (data: { user: { id: string; email: string; name: string; phone?: string; role: string } }) => void;
  onError: (error: Error) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
}

export function GoogleSignInButton({ onSuccess, onError, text = "signin_with" }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [configError, setConfigError] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setConfigError(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || initializedRef.current) return;
    if (!window.google?.accounts?.id || !buttonRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setConfigError(true);
      return;
    }

    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          const res = await fetch("/api/auth/customer/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Google sign-in failed");
          }
          onSuccess(data);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err : new Error("Google sign-in failed");
          onError(msg);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text,
      shape: "pill",
    });
  }, [scriptLoaded, onSuccess, onError, text]);

  if (configError) {
    return (
      <div className="w-full text-center py-3 px-4 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs">
        Google sign-in is temporarily unavailable
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div ref={buttonRef} className="w-full flex justify-center [&>div]:w-full!" />
    </div>
  );
}
