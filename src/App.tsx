import { useState } from "react"
import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm, CaboFormField } from "./components/forms/cabo-form"
import { Button } from "./components/ui/button";
import { cabos } from "./data/cabos";
import { postes } from "./data/poste";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ResultadoFinalTable } from "./components/ResultadoFinalTable";

type EsforcoCabo = {
  [key: string]: {
    esforcoTotal: number;
    esforcoRefletidoX: number;
    esforcoRefletidoY: number;
  }
}

export type ResultadoFinal = {
  esforcoResultanteX: number;
  esforcoResultanteY: number;
  esforcoResultante: number;
  anguloResultante: number;
}

export default function App() {
  const [pressaoDinamicaRef, setPressaoDinamicaRef] = useState(0)
  const [alturaPoste, setAlturaPoste] = useState<number>()
  const [caboForms, setCaboForms] = useState<CaboFormField[]>([
    {
      angulo: 0,
      porcentagemDaFlecha: 0,
      tipoDeCabo: cabos[0].name,
      vao: 0
    },
  ]);
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>({
    anguloResultante: 0,
    esforcoResultante: 0,
    esforcoResultanteX: 0,
    esforcoResultanteY: 0,
  })

  const pressaoDinamica = (resultado: number) => {
    setPressaoDinamicaRef(resultado)
  }

  const handleSetAlturaPoste = (altura: number) => {
    setAlturaPoste(altura)
  }

  function grausParaRadianos(graus: number) {
    return graus * (Math.PI / 180);
  }

  function radianosParaGraus(radianos: number) {
    return radianos * (180 / Math.PI);
  }

  const calculaTracaoInicial = () => {
    let esforcosTotais: EsforcoCabo = {};
    const poste = postes.find(poste => poste.altura === alturaPoste);

    if (!poste) return;

    caboForms.forEach((caboForm, index) => {
      const cabo = cabos.find(cabo => cabo.name === caboForm.tipoDeCabo) || cabos[0];
      const tracaoInicial = (cabo?.weight * (caboForm.vao ** 2)) / (8 * (caboForm.porcentagemDaFlecha * caboForm.vao));
      const cargaDoVento = pressaoDinamicaRef * 1 * 1 * cabo.diameter * (caboForm.vao / 2) * 1;
      const esforcoTotal = tracaoInicial + cargaDoVento;
      const esforcoRefletido = esforcoTotal * poste.fatorMultiplicacao;
      const esforcoRefletidoX = Math.cos(grausParaRadianos(caboForm.angulo)) * esforcoRefletido;
      const esforcoRefletidoY = Math.sin(grausParaRadianos(caboForm.angulo)) * esforcoRefletido;

      esforcosTotais[`${cabo.name}_${index}`] = {
        esforcoTotal,
        esforcoRefletidoX,
        esforcoRefletidoY
      };
    });

    let esforcoResultanteX = 0;
    let esforcoResultanteY = 0;

    Object.keys(esforcosTotais).forEach(cabo => {
      esforcoResultanteX += esforcosTotais[cabo].esforcoRefletidoX;
      esforcoResultanteY += esforcosTotais[cabo].esforcoRefletidoY;
    })

    const esforcoResultante = Math.sqrt((esforcoResultanteX ** 2) + (esforcoResultanteY ** 2) - 2 * esforcoResultanteX * esforcoResultanteY * Math.cos(grausParaRadianos(90)))
    const anguloResultante = Math.acos(
      ((esforcoResultante ** 2) + (esforcoResultanteX ** 2) - (esforcoResultanteY ** 2)) / (2 * esforcoResultante * esforcoResultanteX)
    );

    setResultadoFinal({
      anguloResultante: radianosParaGraus(anguloResultante),
      esforcoResultante,
      esforcoResultanteX,
      esforcoResultanteY
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cálculo de Esforço
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <div className="flex justify-between">
            <Button
              onClick={() => setCaboForms(prev => {
                return [...prev, {
                  angulo: 0,
                  porcentagemDaFlecha: 0,
                  tipoDeCabo: cabos[0].name,
                  vao: 0
                }]
              })}
            >
              Adicionar cabo
            </Button>
            <Button onClick={calculaTracaoInicial}>Calcular</Button>
          </div>
          <AmbienteForm setAlturaPoste={handleSetAlturaPoste} setPressaoDinamicaRef={pressaoDinamica} />
          {caboForms.map((caboForm, index) => (
            <CaboForm
              key={index}
              index={index}
              fields={caboForm}
              setFields={(newFields) => {
                const updated = [...caboForms];
                updated[index] = newFields;
                setCaboForms(updated);
              }}
            />
          ))}
        </div>
        {
          resultadoFinal.esforcoResultante &&
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Resultado Final</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultadoFinalTable dados={resultadoFinal} />
              </CardContent>
            </Card>
        }
      </div>
    </div>
  )
}