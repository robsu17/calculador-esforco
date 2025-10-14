
import { useState } from "react"
import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm, CaboFormField } from "./components/forms/cabo-form"
import { Button } from "./components/ui/button";
import { cabos } from "./data/cabos";
import { postes } from "./data/poste";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ResultadoFinalTable } from "./components/ResultadoFinalTable";
import { DiagramaPoste } from "./components/DiagramaPoste";
import { useRef } from 'react'

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

export type EsforcoCaboIndividual = {
  [key: string]: {
    esforcoTotal: number;
    esforcoRefletidoX: number;
    esforcoRefletidoY: number;
  }
}

export default function App() {
  const [pressaoDinamicaRef, setPressaoDinamicaRef] = useState(0)
  const [alturaPoste, setAlturaPoste] = useState<number>()
  const [caboForms, setCaboForms] = useState<CaboFormField[]>([
]);
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>({
    anguloResultante: 0,
    esforcoResultante: 0,
    esforcoResultanteX: 0,
    esforcoResultanteY: 0,
  })
  const [esforcosCabo, setEsforcosCabo] = useState<EsforcoCaboIndividual>({})
  const [esforcoPoste, setEsforcoPoste] = useState<number>(300)
  const caboIdCounter = useRef(0)

  const removeCabo = (id: string) => {
    const cabosFiltered = caboForms.filter((value) => value.id !== id);
    setCaboForms(cabosFiltered)
  }

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

  const handleSetEsforcoPoste = (esforco: number) => {
    setEsforcoPoste(esforco)
  }

  const calculaTracaoInicial = () => {
    if (caboForms.length === 0) {
      alert('É preciso de pelo menos 1 cabo para realizar o calculo!')
    }

    let esforcosTotais: EsforcoCabo = {};
    const poste = postes.find(poste => poste.altura === alturaPoste);

    if (!poste) return;

    caboForms.forEach((caboForm, index) => {
      const cabo = cabos.find(c => c.name === caboForm.tipoDeCabo) || cabos[0];
      const tracaoInicial = (cabo?.weight * (caboForm.vao ** 2)) / (8 * (caboForm.porcentagemDaFlecha * caboForm.vao));
      const cargaDoVento = pressaoDinamicaRef * cabo.diameter * (caboForm.vao / 2);
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

    const esforcoResultante = Math.sqrt(esforcoResultanteX ** 2 + esforcoResultanteY ** 2);
    const anguloResultante = Math.atan2(esforcoResultanteY, esforcoResultanteX);

    setEsforcosCabo(esforcosTotais);
    setResultadoFinal({
      anguloResultante: radianosParaGraus(anguloResultante),
      esforcoResultante,
      esforcoResultanteX,
      esforcoResultanteY
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-emerald-700 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-100 mb-10 tracking-tight">
          Cálculo de Esforço em Postes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-700">Configuração do Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    caboIdCounter.current += 1
                    const newId = `cabo_${caboIdCounter.current}`
                    setCaboForms(prev => [
                      ...prev,
                      {
                        id: newId,
                        angulo: 0,
                        porcentagemDaFlecha: 0,
                        tipoDeCabo: cabos[0].name,
                        vao: 0
                      },
                    ])
                  }}
                >
                  ➕ Adicionar cabo
                </Button>
                <Button onClick={calculaTracaoInicial} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Calcular
                </Button>
              </div>

              <AmbienteForm
                setAlturaPoste={handleSetAlturaPoste}
                setPressaoDinamicaRef={pressaoDinamica}
                setEsforcoPoste={handleSetEsforcoPoste}
              />

              <div className="space-y-5">
                {caboForms.map((caboForm, index) => (
                  <div key={caboForm.id} className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50">
                    <CaboForm
                      id={caboForm.id}
                      index={index}
                      fields={caboForm}
                      removeCabo={removeCabo}
                      setFields={(newFields) => {
                        const updated = [...caboForms];
                        // preserve existing id and merge changes
                        updated[index] = { ...updated[index], ...newFields, id: updated[index].id };
                        setCaboForms(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card de Resultado */}
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-700">Resultado Final</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ResultadoFinalTable dados={resultadoFinal} />
              <DiagramaPoste
                caboForms={caboForms}
                resultadoFinal={resultadoFinal}
                esforcosCabo={esforcosCabo}
                esforcoPoste={esforcoPoste}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
