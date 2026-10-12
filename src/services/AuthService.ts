import { supabase } from '../lib/supabase';

export const AuthService = {
  async registrar(email: string, pass: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  async iniciarSesion(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  },

  async cerrarSesion() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async obtenerSesionActual() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};