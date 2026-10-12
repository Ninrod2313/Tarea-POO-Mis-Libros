import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { supabase } from "./src/lib/supabase";
import { AuthService } from "./src/services/AuthService";
import { LibroRepository } from "./src/repositories/LibroRepository";
import { Libro } from "./src/models/Libro";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para Login / Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados para Home (Libros)
  const [libros, setLibros] = useState<Libro[]>([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anio, setAnio] = useState("");

  const libroRepo = LibroRepository.getInstance();

  // Control de sesión al iniciar y escuchar cambios
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cargar libros desde Supabase cuando hay sesión activa
  useEffect(() => {
    if (session) {
      cargarLibros();
    }
  }, [session]);

  const cargarLibros = async () => {
    try {
      const data = await libroRepo.obtenerLibros();
      setLibros(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los libros desde Supabase.");
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña.");
      return;
    }

    try {
      if (isRegistering) {
        console.log("Intentando registrar con:", email);
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          console.error("Error de Supabase SignUp:", error.message);
          Alert.alert("Error de Registro", error.message);
          return;
        }

        console.log("Respuesta de registro exitoso:", data);
        if (data.session) {
          setSession(data.session);
        } else {
          Alert.alert("¡Éxito!", "Cuenta registrada correctamente. Por favor inicia sesión.");
          setIsRegistering(false);
        }
      } else {
        console.log("Intentando iniciar sesión con:", email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          console.error("Error de Supabase SignIn:", error.message);
          Alert.alert("Error de Inicio de Sesión", error.message);
          return;
        }

        console.log("Login exitoso:", data);
        setSession(data.session);
      }
    } catch (error: any) {
      console.error("Excepción en handleAuth:", error);
      Alert.alert("Error", error.message || "Ocurrió un error en la autenticación.");
    }
  };

  const agregarLibro = async () => {
    if (!titulo || !autor || !anio) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    try {
      const nuevoLibro = new Libro(0, titulo, autor, Number(anio));
      await libroRepo.agregarLibro(nuevoLibro);
      
      setTitulo("");
      setAutor("");
      setAnio("");
      cargarLibros();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el libro.");
    }
  };

  const eliminarLibro = async (id?: number) => {
    if (!id) return;
    try {
      await libroRepo.eliminarLibro(id);
      cargarLibros();
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el libro.");
    }
  };

  const cerrarSesion = async () => {
    try {
      await AuthService.cerrarSesion();
      setSession(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // FLUJO DE AUTENTICACIÓN (Login / Registro)
  if (!session || !session.user) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Libros</Text>
        <Text style={styles.subtitulo}>{isRegistering ? "Registro de Usuario" : "Iniciar Sesión"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botonPrincipal} onPress={handleAuth}>
          <Text style={styles.textoBoton}>{isRegistering ? "Registrarse" : "Entrar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.linkSwitch}>
            {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // PANTALLA PRINCIPAL (Home - Libros)
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>Mis Libros</Text>
        <TouchableOpacity onPress={cerrarSesion} style={styles.botonSalir}>
          <Text style={styles.textoSalir}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Título del libro"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Año"
        value={anio}
        onChangeText={setAnio}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botonPrincipal} onPress={agregarLibro}>
        <Text style={styles.textoBoton}>Agregar libro</Text>
      </TouchableOpacity>

      <FlatList
        data={libros}
        keyExtractor={(item: any) => item.getId().toString()}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.libro}>
            <Text style={styles.nombre}>{item.getTitulo()}</Text>
            <Text>Autor: {item.getAutor()}</Text>
            <Text>Año: {item.getAnio()}</Text>

            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() => eliminarLibro(item.getId())}
            >
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  botonPrincipal: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkSwitch: {
    textAlign: "center",
    color: "#007AFF",
    marginTop: 10,
    fontSize: 14,
  },
  botonSalir: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoSalir: {
    color: "white",
    fontWeight: "bold",
  },
  libro: {
    backgroundColor: "white",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  botonEliminar: {
    backgroundColor: "#ff3b30",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  textoEliminar: {
    color: "white",
    fontWeight: "bold",
  },
});