import { useEffect, useState } from "react";

export type Tema = "claro" | "oscuro";

// La misma clave y la misma lógica que el script inline de index.html
const CLAVE = "nebula-tema";
const CONSULTA_OSCURO = "(prefers-color-scheme: dark)";

const leerGuardado = (): Tema | null => {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor === "claro" || valor === "oscuro" ? valor : null;
  } catch {
    return null;
  }
};

const temaDelSistema = (): Tema =>
  window.matchMedia(CONSULTA_OSCURO).matches ? "oscuro" : "claro";

export const useTema = () => {
  const [tema, setTema] = useState<Tema>(() => leerGuardado() ?? temaDelSistema());

  // Bootstrap 5.3 cambia todos sus colores según data-bs-theme en <html>
  useEffect(() => {
    document.documentElement.dataset.bsTheme = tema === "oscuro" ? "dark" : "light";
  }, [tema]);

  // Mientras el usuario no haya elegido, sigue los cambios del sistema
  useEffect(() => {
    const media = window.matchMedia(CONSULTA_OSCURO);
    const alCambiar = () => {
      if (!leerGuardado()) setTema(temaDelSistema());
    };
    media.addEventListener("change", alCambiar);
    return () => media.removeEventListener("change", alCambiar);
  }, []);

  const alternarTema = () => {
    const nuevo: Tema = tema === "oscuro" ? "claro" : "oscuro";
    setTema(nuevo);
    try {
      localStorage.setItem(CLAVE, nuevo);
    } catch {
      // Sin almacenamiento (modo privado): el tema se aplica igual, pero no se recuerda
    }
  };

  return { tema, alternarTema };
};
