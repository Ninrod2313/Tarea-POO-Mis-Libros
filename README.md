# Aplicación Mis Libros - Tarea 7

Aplicación móvil y web de gestión de libros desarrollada en **React Native** con **TypeScript**, utilizando el patrón arquitectónico **Singleton** para el repositorio de datos, control de sesiones seguro y persistencia en la nube mediante **Supabase (Auth & Database)** con políticas de seguridad RLS (Row Level Security).

## Características Implementadas
- **Autenticación completa:** Registro e inicio de sesión de usuarios conectado a Supabase Auth.
- **Control de sesión:** Restricción de pantallas basada en el estado de autenticación activo del usuario.
- **Persistencia en la Nube (CRUD):** Creación, lectura y eliminación de registros de libros en una base de datos PostgreSQL protegida.
- **Patrón Singleton:** Implementado en `LibroRepository` para centralizar el acceso único a los datos.

## Tecnologías Utilizadas
- React Native / Expo
- TypeScript
- Supabase (Autenticación y Base de Datos PostgreSQL)
- `@react-native-async-storage/async-storage` para persistencia de sesión

