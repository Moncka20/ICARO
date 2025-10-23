import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import styles from '../styles/layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, rol")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPerfil(data);
      }
    };

    fetchPerfil();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Inventario", path: "/productos" },
    { name: "Ventas", path: "/ventas" },
    { name: "Proveedores", path: "/proveedores" },
  ];

  if (perfil?.rol === "administrador") {
    menuItems.push({ name: "Usuarios", path: "/usuarios" });
  }

  return (
    <div className={styles.layoutContainer}>
    {/* NAVBAR LATERAL */}
    <aside className={styles.sidebar}>
      <div className={styles.logo}>ICARO</div>

      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className={`${styles.navButton} ${
            router.pathname === item.path ? styles.activeNav : ''
          }`}
        >
          {item.name}
        </button>
      ))}

      <div className={styles.profileSection}>
        {perfil && (
          <p className={styles.profileText}>
            {perfil.nombre} ({perfil.rol})
          </p>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
      </div>
    </aside>

    {/* CONTENIDO PRINCIPAL */}
    <main className={styles.mainContent}>
      {children}
    </main>
  </div>
  );
}
