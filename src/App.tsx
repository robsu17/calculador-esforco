import { useState } from "react"
import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm, CaboFormField } from "./components/forms/cabo-form"
import { tiposDeCabos } from "./data/cabos";

export default function App() {
  const [caboForms, setCaboForms] = useState<CaboFormField[]>([
    {
      angulo: 0,
      porcentagemDaFlecha: 0,
      tipoDeCabo: tiposDeCabos[0],
      vao: 0
    },
    {
      angulo: 0,
      porcentagemDaFlecha: 0,
      tipoDeCabo: tiposDeCabos[0],
      vao: 0
    },
  ])

  const massaEspecificaResultado = (resultado: number) => {
    //
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cálculo de Esforço
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <AmbienteForm setMassaEspecificaAr={massaEspecificaResultado} />
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