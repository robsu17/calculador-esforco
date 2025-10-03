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
    <Card>
      <CardHeader>
        <CardTitle>
          Cabo {(index + 1).toString().padStart(2, "0")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-3">
            <Label>Tipo do cabo</Label>
            <Select
              value={fields.tipoDeCabo}
              onValueChange={(value) =>
                setFields({ ...fields, tipoDeCabo: value })
              }
            >
              <SelectTrigger className="w-full">{fields.tipoDeCabo}</SelectTrigger>
              <SelectContent >
                {cabos.map((cabo, index) => (
                  <SelectItem key={index} value={cabo.name}>
                    {cabo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Vão em (m)</Label>
            <Input
              type="number"
              value={fields.vao}
              onChange={(e) =>
                setFields({ ...fields, vao: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Ângulo</Label>
            <Input
              type="number"
              value={fields.angulo}
              onChange={(e) =>
                setFields({ ...fields, angulo: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-3">
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
