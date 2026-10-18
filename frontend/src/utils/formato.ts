// <input type="date"> necesita "AAAA-MM-DD": son los 10 primeros caracteres del ISO
export const fechaParaInput = (fechaIso?: string | null) =>
  fechaIso ? fechaIso.slice(0, 10) : "";
