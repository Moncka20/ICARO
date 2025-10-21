import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error al obtener sesión:", error);
        router.push("/login");
        return;
      }

      if (session) {
        // Si ya está logueado → va al dashboard
        router.push("/dashboard");
      } else {
        // Si no hay sesión → va al login
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-700 animate-pulse">
        Cargando aplicación...
      </h1>
    </div>
  );
}



