import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import styles from '../styles/loginPage.module.css'


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
  <div className={styles.container}>
    <form onSubmit={handleAuth} className={styles.form}>
      <h2 className={styles.title}>
        {isRegistering ? "Registrar usuario" : "Iniciar sesión"}
      </h2>

      {isRegistering && (
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={styles.input}
          required
        />
      )}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        required
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        {isRegistering ? "Registrarse" : "Iniciar sesión"}
      </button>

      <p className={styles.switchText}>
        {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <button
          type="button"
          className={styles.switchButton}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Inicia sesión" : "Regístrate"}
        </button>
      </p>
    </form>
  </div>
)
}
