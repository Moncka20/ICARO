import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      let { data, error } = await supabase.from('productos').select('*');
      if (error) console.error(error);
      else setProductos(data);
    }
    fetchProductos();
  }, []);

  return (
    <div>
      <h1>Inventario</h1>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>{p.nombre} - {p.stock} unidades</li>
        ))}
      </ul>
    </div>
  );
}

