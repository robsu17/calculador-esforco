import { useEffect, useRef, useState } from "react"
import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm, CaboFormField } from "./components/forms/cabo-form"
import { Button } from "./components/ui/button";
import { cabos } from "./data/cabos";
import { postes } from "./data/poste";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ResultadoFinalTable } from "./components/ResultadoFinalTable";
import { DiagramaPoste } from "./components/DiagramaPoste";

type EsforcoCabo = Record<string, {
  esforcoTotal: number;
  esforcoRefletidoX: number;
  esforcoRefletidoY: number;
}>;

export type ResultadoFinal = {
  esforcoResultanteX: number;
  esforcoResultanteY: number;
  esforcoResultante: number;
  anguloResultante: number;
};

export type EsforcoCaboIndividual = EsforcoCabo;

export default function App() {
  const [pressaoDinamicaRef, setPressaoDinamicaRef] = useState(0)
  const [alturaPoste, setAlturaPoste] = useState<number>()
  const [caboForms, setCaboForms] = useState<CaboFormField[]>([])
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal>({
    anguloResultante: 0,
    esforcoResultante: 0,
    esforcoResultanteX: 0,
    esforcoResultanteY: 0,
  })
  const [esforcosCabo, setEsforcosCabo] = useState<EsforcoCaboIndividual>({})
  const [esforcoPoste, setEsforcoPoste] = useState(300)
  const caboIdCounter = useRef(0)

  const grausParaRadianos = (graus: number) => graus * (Math.PI / 180)
  const radianosParaGraus = (radianos: number) => radianos * (180 / Math.PI)

  const removeCabo = (id: number) => setCaboForms(prev => prev.filter(c => c.id !== id))

  const handleAddNewCabo = () => {
    const ultimo = caboForms[caboForms.length - 1]
    if (
      caboForms.length > 0 &&
      (
        !ultimo?.angulo ||
        !ultimo?.porcentagemDaFlecha ||
        !ultimo?.tipoDeCabo ||
        !ultimo?.vao
      )
    ) {
      alert('Preencha os valores do último cabo adicionado antes de criar outro.')
      return
    }

    caboIdCounter.current += 1
    setCaboForms(prev => [...prev, { id: caboIdCounter.current, angulo: null, porcentagemDaFlecha: null, tipoDeCabo: null, vao: null }])
  }

  const calculaTracaoInicial = () => {
    const ultimo = caboForms[caboForms.length - 1]
    if (
      !ultimo?.angulo ||
      !ultimo?.porcentagemDaFlecha ||
      !ultimo?.tipoDeCabo ||
      !ultimo?.vao
    ) {
      alert(`Preencha os valores do cabo ${ultimo?.id ?? ''} para realizar o cálculo.`)
      return
    }

    const poste = postes.find(p => p.altura === alturaPoste)
    if (!poste) {
      alert('Selecione uma altura de poste válida.')
      return
    }

    const esforcosTotais: EsforcoCabo = {}

    caboForms.forEach((caboForm, index) => {
      if (!caboForm.vao || !caboForm.porcentagemDaFlecha) return
      const cabo = cabos.find(c => c.name === caboForm.tipoDeCabo) || cabos[0]

      const denominador = 8 * (caboForm.porcentagemDaFlecha * caboForm.vao)
      if (denominador === 0) return

      const tracaoInicial = (cabo.weight * (caboForm.vao ** 2)) / denominador
      const cargaDoVento = pressaoDinamicaRef * cabo.diameter * (caboForm.vao / 2)
      const esforcoTotal = tracaoInicial + cargaDoVento
      const esforcoRefletido = esforcoTotal * poste.fatorMultiplicacao
      const esforcoRefletidoX = Math.cos(grausParaRadianos(caboForm.angulo || 1)) * esforcoRefletido
      const esforcoRefletidoY = Math.sin(grausParaRadianos(caboForm.angulo || 1)) * esforcoRefletido

      esforcosTotais[`${cabo.name}_${index}`] = {
        esforcoTotal,
        esforcoRefletidoX,
        esforcoRefletidoY,
      }
    })

    const esforcoResultanteX = Object.values(esforcosTotais).reduce((acc, c) => acc + c.esforcoRefletidoX, 0)
    const esforcoResultanteY = Object.values(esforcosTotais).reduce((acc, c) => acc + c.esforcoRefletidoY, 0)
    const esforcoResultante = Math.hypot(esforcoResultanteX, esforcoResultanteY)
    const anguloResultante = (radianosParaGraus(Math.atan2(esforcoResultanteY, esforcoResultanteX)) + 360) % 360

    setEsforcosCabo(esforcosTotais)
    setResultadoFinal({ anguloResultante, esforcoResultante, esforcoResultanteX, esforcoResultanteY })
  }

  useEffect(() => {
    if (caboForms.length === 0) caboIdCounter.current = 0
  }, [caboForms.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-emerald-800 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">
          Cálculo de Esforço em Postes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold text-gray-700">Configuração do Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AmbienteForm
                setAlturaPoste={setAlturaPoste}
                setPressaoDinamicaRef={setPressaoDinamicaRef}
                setEsforcoPoste={setEsforcoPoste}
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
                        const updated = [...caboForms]
                        updated[index] = { ...updated[index], ...newFields }
                        setCaboForms(updated)
                      }}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleAddNewCabo}>
                    ➕ Adicionar cabo
                  </Button>
                  <Button onClick={calculaTracaoInicial} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Calcular
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
