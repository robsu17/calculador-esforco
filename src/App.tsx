import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cálculo de Esforço
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura coincidente em (°C)</Label>
                <Input type="number" placeholder="Digite o valor do esforço" id="temperatura" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altitude">Altitude média da região em (m)</Label>
                <Input type="number" placeholder="Digite o valor do esforço" id="altitude" />
              </div>
            </div>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
