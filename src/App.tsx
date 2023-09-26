// @ts-nocheck
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Session from "./Session";

const views: string[] = [
  "sign_in",
  "sign_up",
  "magic_link",
  "forgotten_password",
  "update_password",
  "verify_otp",
];

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState(views[0]);
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let v = searchParams.get("view");
    if (views.includes(v)) {
      setView(v);
    }
  }, []);

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "500px",
        }}
      >
        <div
          style={{
            width: "350px",
          }}
        >
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            view={view}
            providers={[]}
          />
        </div>
      </div>
    );
  } else {
    return <Session supabase={supabase} />;
  }
}
