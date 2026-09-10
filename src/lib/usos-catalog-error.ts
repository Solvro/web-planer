export class CatalogCourseNotFoundError extends Error {
  constructor(code: string) {
    super(`Nie znaleziono przedmiotu o kodzie ${code} w katalogu USOSweb.`);
    this.name = "CatalogCourseNotFoundError";
  }
}
