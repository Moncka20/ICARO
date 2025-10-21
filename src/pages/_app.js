import '@/styles/globals.css'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Recuperar sesión actual
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Escuchar cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} session={session} />
}
