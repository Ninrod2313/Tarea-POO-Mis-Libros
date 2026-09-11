## Reflexión

### ¿Por qué es conveniente separar la lógica de los libros de App.tsx?

Es conveniente porque permite mantener el código más ordenado y fácil de entender. App.tsx se encarga principalmente de la interfaz de la aplicación, mientras que la lógica relacionada con los libros se coloca en otras clases. Esto también facilita realizar cambios o agregar nuevas funciones en el futuro.

### ¿Qué responsabilidad tiene LibroService?

LibroService se encarga de administrar la lista de libros. Su responsabilidad es realizar operaciones como agregar un libro, eliminar un libro y obtener la lista de libros.

### ¿Qué responsabilidad tiene la clase Libro?

La clase Libro se encarga de representar cada libro dentro de la aplicación. Contiene sus datos principales, como id, título, autor y año. También contiene métodos que permiten acceder y trabajar con la información del libro.