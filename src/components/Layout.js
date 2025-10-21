import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

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
    { name: "Inventario", path: "/inventario" },
    { name: "Ventas", path: "/ventas" },
    { name: "Proveedores", path: "/proveedores" },
  ];

  if (perfil?.rol === "administrador") {
    menuItems.push({ name: "Usuarios", path: "/usuarios" });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* NAVBAR LATERAL */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">ICARO</h2>

        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`text-left p-2 rounded hover:bg-blue-800 ${
              router.pathname === item.path ? "bg-blue-900" : ""
            }`}
          >
            {item.name}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-blue-500">
          {perfil && (
            <p className="text-sm mb-2">
              {perfil.nombre} ({perfil.rol})
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
