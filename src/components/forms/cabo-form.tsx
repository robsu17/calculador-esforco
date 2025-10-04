import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cabos } from "@/data/cabos";

export type CaboFormField = {
  vao: number;
  angulo: number;
  porcentagemDaFlecha: number;
  tipoDeCabo: string;
};

interface CaboFormProps {
  index: number;
  fields: CaboFormField;
  setFields: (value: CaboFormField) => void;
}

export function CaboForm({ index, fields, setFields }: CaboFormProps) {
  return (
    <Card className="rounded-xl shadow-md border border-gray-200">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold text-gray-700">
          Cabo {(index + 1).toString().padStart(2, "0")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Tipo do Cabo */}
          <div className="flex flex-col space-y-1">
            <Label>Tipo do cabo</Label>
            <Select
              value={fields.tipoDeCabo}
              onValueChange={(value) =>
                setFields({ ...fields, tipoDeCabo: value })
              }
            >
              <SelectTrigger className="w-full min-w-[120px]">{fields.tipoDeCabo}</SelectTrigger>
              <SelectContent>
                {cabos.map((cabo, idx) => (
                  <SelectItem key={idx} value={cabo.name}>
                    {cabo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vão */}
          <div className="flex flex-col space-y-1">
            <Label>Vão (m)</Label>
            <Input
              type="number"
              value={fields.vao}
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
              value={fields.angulo}
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
              value={fields.porcentagemDaFlecha}
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
