import { useEffect, useRef, useState } from "react";
import { DiagramaPoste } from "./components/DiagramaPoste";
import { AmbienteForm } from "./components/forms/ambiente-form";
import { CaboForm, CaboFormField } from "./components/forms/cabo-form";
import { ResultadoFinalTable } from "./components/ResultadoFinalTable";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import ToastProvider, { showToast } from "./components/ui/toast";
import { cabosBT, cabosFibra, cabosMT } from "./data/cabos";
import { postes } from "./data/poste";

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
  const [temperatura, setTemperatura] = useState<number>();
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
        ultimo?.angulo === null ||
        (!ultimo?.porcentagemDaFlecha && !ultimo?.flecha) ||
        !ultimo?.tipoDeCabo ||
        !ultimo?.vao ||
        !ultimo?.tipoDeCaboSelecionado
      )
    ) {
      showToast('Preencha os valores do último cabo adicionado antes de criar outro.')
      return
    }

    caboIdCounter.current += 1
    setCaboForms(prev => [...prev, { id: caboIdCounter.current, angulo: null, porcentagemDaFlecha: null, flecha: null, tipoDeCabo: null, vao: null, tipoDeCaboSelecionado: "fibra" }])
  }

  const calculaTracaoInicial = () => {
    const ultimo = caboForms[caboForms.length - 1]
    if (
      ultimo?.angulo === null ||
      (!ultimo?.porcentagemDaFlecha && !ultimo?.flecha) ||
      !ultimo?.tipoDeCabo ||
      !ultimo?.vao ||
      !ultimo?.tipoDeCaboSelecionado
    ) {
      showToast(`Preencha os valores do cabo ${ultimo?.id ?? ''} para realizar o cálculo.`)
      return
    }

    const poste = postes.find(p => p.altura === alturaPoste)
    if (!poste) {
      showToast('Selecione uma altura de poste válida.')
      return
    }

    const esforcosTotais: EsforcoCabo = {}

    caboForms.forEach((caboForm, index) => {
      if (!caboForm.vao || (!caboForm.porcentagemDaFlecha && !caboForm.flecha)) return
      let cabo;

      switch (caboForm.tipoDeCaboSelecionado) {
        case "fibra":
          cabo = cabosFibra.find(c => c.name === caboForm.tipoDeCabo)
          break;
        case "bt":
          cabo = cabosBT.find(c => c.name === caboForm.tipoDeCabo)
          break;
        case "mt":
          cabo = cabosMT.find(c => c.name === caboForm.tipoDeCabo)
          break;
        default:
          return;
      }

      if (!cabo) return;

      let sag = 0;
      if (caboForm.flecha) {
        sag = caboForm.flecha;
      } else if (caboForm.porcentagemDaFlecha) {
        sag = caboForm.porcentagemDaFlecha * caboForm.vao;
      }

      const denominador = 8 * sag
      if (denominador === 0) return

      let tracaoInicial = (cabo.weight * (caboForm.vao ** 2)) / denominador
      const cargaDoVento = pressaoDinamicaRef * cabo.diameter * (caboForm.vao / 2)

      if (caboForm.tipoDeCaboSelecionado === "mt" && caboForm.vao <= 45) {
        tracaoInicial = tracaoInicial * 3;
      }

      let esforcoTotal = tracaoInicial + cargaDoVento

      if (
        (caboForm.tipoDeCaboSelecionado === "bt" ||
          caboForm.tipoDeCaboSelecionado === "mt") && caboForm.vao > 45
      ) {
        if (caboForm.tipoDeCaboSelecionado === "bt") {
          switch (cabo.name) {
            case "3x35+1x54,6":
              esforcoTotal = 243;
              break;
            case "3x50+1x54,6":
              esforcoTotal = 265;
              break;
            case "3x95+1x54,6":
              esforcoTotal = 393;
              break;
            case "3x150+1x80":
              esforcoTotal = 554;
              break;
          }
        }

        if (caboForm.tipoDeCaboSelecionado === "mt") {
          switch (cabo.name) {
            case "4AWG CAA ou 4AWG CAA/AW":
              esforcoTotal = 285;
              break;
            case "1/0AWG CAA ou 1/0AWG CAA/AW":
              esforcoTotal = 618;
              break;
            case "2/0AWG CAA":
              esforcoTotal = 771;
              break;
          }
        }
      }

      let esforcoRefletido: number;
      switch (caboForm.tipoDeCaboSelecionado) {
        case "fibra":
          esforcoRefletido = esforcoTotal * poste.fatorMultiplicacao
          break;
        case "bt": 
          esforcoRefletido = esforcoTotal * poste.fatorMultiplicacaoBT
          break;
        default:
          esforcoRefletido = esforcoTotal * 1; 
          break;
      }
      const esforcoRefletidoX = Math.cos(grausParaRadianos(caboForm.angulo ?? 1)) * esforcoRefletido
      const esforcoRefletidoY = Math.sin(grausParaRadianos(caboForm.angulo ?? 1)) * esforcoRefletido

      esforcosTotais[`${cabo.name}_${index}`] = {
        esforcoTotal,
        esforcoRefletidoX,
        esforcoRefletidoY,
      }
    });

    const esforcoResultanteX = Object.values(esforcosTotais).reduce((acc, c) => acc + c.esforcoRefletidoX, 0)
    const esforcoResultanteY = Object.values(esforcosTotais).reduce((acc, c) => acc + c.esforcoRefletidoY, 0)
    const esforcoResultante = Math.hypot(esforcoResultanteX, esforcoResultanteY)
    const anguloResultante = (radianosParaGraus(Math.atan2(esforcoResultanteY, esforcoResultanteX)) + 360) % 360

    setEsforcosCabo(esforcosTotais)
    setResultadoFinal({ anguloResultante, esforcoResultante, esforcoResultanteX, esforcoResultanteY })
  }

  const onSetTemperatura = (value: number) => {
    setTemperatura(value)
  }

  useEffect(() => {
    if (caboForms.length === 0) caboIdCounter.current = 0
  }, [caboForms.length])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-emerald-800 flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-6xl w-full mx-auto p-8">
            <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">
              Cálculo de Esforço em Postes
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-700">Parâmetros de Entrada do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AmbienteForm
                    setAlturaPoste={setAlturaPoste}
                    setPressaoDinamicaRef={setPressaoDinamicaRef}
                    setEsforcoPoste={setEsforcoPoste}
                    setTemperatura={onSetTemperatura}
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
                          temperatura={temperatura}
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
        </main>

        <footer className="bg-emerald-900 text-emerald-100 py-4 mt-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
            <p className="opacity-90">
              © {new Date().getFullYear()} Desenvolvido com 💡 e precisão por{" "}
              <span className="font-semibold text-emerald-300">
                <a href="https://www.linkedin.com/in/robson-lima-ba5bb31a8" target="_blank">Robson Wendel</a> e {' '}
                <a href="https://www.linkedin.com/in/laiane-meneses" target="_blank">Laiane Meneses</a>
              </span>.
            </p>
            <p className="text-xs mt-1 opacity-70">
              Cálculo automatizado de esforços em postes
            </p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  )
}
