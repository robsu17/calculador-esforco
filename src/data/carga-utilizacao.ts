export const cargaUtilizacao = (angulo: number, esforcoPoste: number) => {
  const anguloAjustado = anguloQuadranteEspelhado(angulo)

  if (anguloAjustado >= 0 && anguloAjustado <= 5) {
    return 1 * esforcoPoste
  } else if (anguloAjustado > 5 && anguloAjustado <= 10) {
    return 0.96 * esforcoPoste
  } else if (anguloAjustado > 10 && anguloAjustado <= 15) {
    return 0.93 * esforcoPoste
  } else if (anguloAjustado > 15 && anguloAjustado <= 20) {
    return 0.89 * esforcoPoste
  } else if (anguloAjustado > 20 && anguloAjustado <= 25) {
    return 0.86 * esforcoPoste
  } else if (anguloAjustado > 25 && anguloAjustado <= 30) {
    return 0.83
  } else if (anguloAjustado > 30 && anguloAjustado <= 40) {
    return 0.77 * esforcoPoste
  } else if (anguloAjustado > 40 && anguloAjustado <= 50) {
    return 0.72 * esforcoPoste
  } else if (anguloAjustado > 50 && anguloAjustado <= 60) {
    return 0.67 * esforcoPoste
  } else if (anguloAjustado > 60 && anguloAjustado <= 70) {
    return 0.62 * esforcoPoste
  } else if (anguloAjustado > 70 && anguloAjustado <= 80) {
    return 0.58 * esforcoPoste
  } else {
    return 0.5 * esforcoPoste
  }
}

const anguloQuadranteEspelhado = (angulo: number) => {
  if (angulo > 90 && angulo <= 180) {
    return 180 - angulo
  } else if (angulo > 180 && angulo <= 270) {
    return angulo - 180
  } else if (angulo > 270 && angulo <= 360) {
    return 360 - angulo
  } else {
    return angulo
  }
}