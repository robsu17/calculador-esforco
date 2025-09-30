import { AmbienteForm } from "./components/forms/ambiente-form"
import { CaboForm } from "./components/forms/cabo-form"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cálculo de Esforço
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <AmbienteForm />
          <CaboForm />
        </div>
      </div>
    </div>
  )
}