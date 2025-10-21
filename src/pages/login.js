import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        // REGISTRO DE NUEVO USUARIO
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Crear fila asociada en tabla usuarios
          const { error: dbError } = await supabase.from("usuarios").insert([
            {
              id: authData.user.id,
              nombre: nombre || "Nuevo usuario",
              rol: "cajero", // Por defecto
            },
          ]);

          if (dbError) throw dbError;
        }

        alert("Cuenta creada correctamente. Revisa tu correo para confirmar.");
        setIsRegistering(false);
      } else {
        // INICIO DE SESIÓN
        const { data: sessionData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;

        const userId = sessionData.user.id;
        const { data: perfil, error: perfilError } = await supabase
          .from("usuarios")
          .select("nombre, rol")
          .eq("id", userId)
          .single();

        if (perfilError) throw perfilError;

        console.log("Usuario autenticado:", perfil);
        alert(`Bienvenido, ${perfil.nombre} (${perfil.rol})`);

        // Redirigir al dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isRegistering ? "Registrar usuario" : "Iniciar sesión"}
        </h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isRegistering ? "Registrarse" : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm">
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </form>
    </div>
  );
}
