
export const tabelaFlechas: Record<number, Record<number, number>> = {
  0: { 5: 1, 10: 4, 15: 10, 20: 17, 25: 27, 30: 39, 35: 53, 40: 69, 45: 87 },
  5: { 5: 1, 10: 5, 15: 11, 20: 19, 25: 30, 30: 42, 35: 56, 40: 73, 45: 91 },
  10: { 5: 2, 10: 6, 15: 13, 20: 22, 25: 32, 30: 45, 35: 60, 40: 76, 45: 95 },
  15: { 5: 2, 10: 7, 15: 15, 20: 24, 25: 35, 30: 48, 35: 63, 40: 80, 45: 99 },
  20: { 5: 3, 10: 9, 15: 17, 20: 26, 25: 38, 30: 51, 35: 66, 40: 83, 45: 102 },
  25: { 5: 4, 10: 10, 15: 18, 20: 28, 25: 40, 30: 54, 35: 69, 40: 87, 45: 106 },
  30: { 5: 5, 10: 12, 15: 20, 20: 31, 25: 43, 30: 57, 35: 72, 40: 90, 45: 109 },
  35: { 5: 6, 10: 13, 15: 22, 20: 33, 25: 45, 30: 59, 35: 75, 40: 93, 45: 113 },
  40: { 5: 6, 10: 14, 15: 24, 20: 35, 25: 48, 30: 62, 35: 78, 40: 96, 45: 116 },
  45: { 5: 7, 10: 16, 15: 26, 20: 37, 25: 50, 30: 65, 35: 81, 40: 98, 45: 120 },
  50: { 5: 8, 10: 17, 15: 27, 20: 39, 25: 52, 30: 67, 35: 84, 40: 102, 45: 123 },
};

export function getFlecha(temperatura: number, vao: number): number | null {
  const temperaturas = Object.keys(tabelaFlechas).map(Number).sort((a, b) => a - b);
  const vaos = Object.keys(tabelaFlechas[0]).map(Number).sort((a, b) => a - b);

  // Encontrar a temperatura mais próxima
  const tempMaisProxima = temperaturas.reduce((prev, curr) => {
    return (Math.abs(curr - temperatura) < Math.abs(prev - temperatura) ? curr : prev);
  });

  // Encontrar o vão mais próximo
  const vaoMaisProximo = vaos.reduce((prev, curr) => {
    return (Math.abs(curr - vao) < Math.abs(prev - vao) ? curr : prev);
  });

  return tabelaFlechas[tempMaisProxima]?.[vaoMaisProximo] ?? null;
}
