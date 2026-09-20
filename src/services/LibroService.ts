import { Libro } from "../models/Libro";
import { LibroRepository } from "../repositories/LibroRepository";

export class LibroService {

  private repository: LibroRepository;

  constructor() {
    this.repository = LibroRepository.getInstance();
  }

  public agregarLibro(libro: Libro): void {
    this.repository.agregarLibro(libro);
  }

  public eliminarLibro(id: number): void {
    this.repository.eliminarLibro(id);
  }

  public obtenerLibros(): Libro[] {
    return this.repository.obtenerLibros();
  }
}