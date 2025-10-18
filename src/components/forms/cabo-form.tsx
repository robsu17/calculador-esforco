import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cabos } from "@/data/cabos";
import { Button } from "../ui/button";

export type CaboFormField = {
  id: number;
  vao: number | null;
  angulo: number | null;
  porcentagemDaFlecha: number | null;
  tipoDeCabo: string | null;
};

interface CaboFormProps {
  id: number;
  index: number;
  fields: CaboFormField;
  setFields: (value: CaboFormField) => void;
  removeCabo: (id: number) => void;
}

export function CaboForm({ id, fields, setFields, removeCabo }: CaboFormProps) {

  const handleRemoveCabo = () => {
    removeCabo(id)
  }

  return (
    <Card className="rounded-xl shadow-md border border-gray-200">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold text-gray-700 flex items-center justify-between">
          Cabo: {id.toString().padStart(2, '0')}
          <Button onClick={handleRemoveCabo} variant="destructive" className="cursor-pointer">
            Remover
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <Label>Tipo do cabo</Label>
            <Select
              onValueChange={(value) =>
                setFields({ ...fields, tipoDeCabo: value })
              }
            >
              <SelectTrigger className="w-full min-w-[120px]">
                <SelectValue placeholder="Selecione o tipo do cabo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {cabos.map((cabo, idx) => (
                    <SelectItem key={idx} value={cabo.name}>
                      {cabo.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Vão */}
          <div className="flex flex-col space-y-1">
            <Label>Vão (m)</Label>
            <Input
              type="number"
              onChange={(e) =>
                setFields({ ...fields, vao: Number(e.target.value) })
              }
              className="w-full min-w-[80px]"
            />
          </div>

          {/* Ângulo */}
          <div className="flex flex-col space-y-1">
            <Label>Ângulo (°)</Label>
            <Input
              type="number"
              onChange={(e) =>
                setFields({ ...fields, angulo: Number(e.target.value) })
              }
              className="w-full min-w-[80px]"
            />
          </div>

          {/* Porcentagem da Flecha */}
          <div className="flex flex-col space-y-1">
            <Label>Porcentagem da Flecha</Label>
            <Input
              type="number"
              step="0.01"
              onChange={(e) =>
                setFields({
                  ...fields,
                  porcentagemDaFlecha: parseFloat(e.target.value),
                })
              }
              className="w-full min-w-[80px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
