import { useState } from "react"
import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm, CaboFormField } from "./components/forms/cabo-form"
import { Button } from "./components/ui/button";
import { cabos } from "./data/cabos";

type ResultadosTracoesIniciais = {
  [key: string]: number
}

type CargaVento = {
  [key: string]: number
}

type EsfocoTotais = {
  [key: string]: number
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
  ])

  const pressaoDinamica = (resultado: number) => {
    setPressaoDinamicaRef(resultado)
  }

  const handleSetAlturaPoste = (altura: number) => {
    setAlturaPoste(altura)
  }

  const calculaTracaoInicial = () => {
    let esforcosTotais: EsfocoTotais = {};
    caboForms.forEach((caboForm, index) => {
      const cabo = cabos.find(cabo => cabo.name === caboForm.tipoDeCabo) || cabos[0]
      const tracaoInicial = (cabo?.weight * (caboForm.vao ** 2)) / (8 * (caboForm.porcentagemDaFlecha * caboForm.vao))
      const cargaDoVento = pressaoDinamicaRef * 1 * 1 * cabo.diameter * (caboForm.vao/2) * 1

      esforcosTotais[`${cabo.name}-${index}`] = tracaoInicial + cargaDoVento;
    });
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
              fields={caboForm}
              setFields={(newFields) => {
                const updated = [...caboForms];
                updated[index] = newFields;
                setCaboForms(updated);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}