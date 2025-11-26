import { cabosBT, cabosFibra } from "@/data/cabos";
import { getFlecha } from "@/data/tabela-flechas";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type CaboFormField = {
  id: number;
  vao: number | null;
  angulo: number | null;
  porcentagemDaFlecha: number | null;
  flecha: number | null;
  tipoDeCabo: string | null;
  tipoDeCaboSelecionado: string | null;
};

interface CaboFormProps {
  id: number;
  index: number;
  fields: CaboFormField;
  setFields: (value: CaboFormField) => void;
  removeCabo: (id: number) => void;
  temperatura?: number;
}

export function CaboForm({ id, fields, setFields, removeCabo, temperatura }: CaboFormProps) {

  const handleRemoveCabo = () => {
    removeCabo(id)
  }

  function gerarValores() {
    const valores = [];
    for (let i = 0; i <= 50; i++) {
      valores.push(i / 10);
    }
    return valores;
  }

  const calculaFlechaBT = () => {
    if (fields.tipoDeCaboSelecionado === 'bt' && temperatura !== undefined && fields.vao) {
      const flechaCm = getFlecha(temperatura, fields.vao);

      if (flechaCm !== null) {
        const flechaM = flechaCm / 100;

        if (fields.flecha !== flechaM) {
          setFields({ ...fields, flecha: flechaM, porcentagemDaFlecha: null });
        }
      }
    }
  }

  useEffect(() => {
    calculaFlechaBT();
  }, [temperatura, fields.vao, fields.tipoDeCaboSelecionado]);

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
      <CardContent className="pt-4 space-y-6">
        <RadioGroup
          defaultValue="fibra"
          className="flex items-center space-x-2"
          onValueChange={(value) => setFields({ ...fields, tipoDeCaboSelecionado: value, flecha: null, porcentagemDaFlecha: null })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fibra" id="fibra" />
            <Label htmlFor="fibra">Fibra Óptica</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bt" id="bt" />
            <Label htmlFor="bt">BT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mt" id="mt" />
            <Label htmlFor="mt">MT</Label>
          </div>
        </RadioGroup>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {fields.tipoDeCaboSelecionado === 'fibra' && (
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
                    {cabosFibra.map((cabo, idx) => (
                      <SelectItem key={idx} value={cabo.name}>
                        {cabo.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {fields.tipoDeCaboSelecionado === 'bt' && (
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
                    {cabosBT.map((cabo, idx) => (
                      <SelectItem key={idx} value={cabo.condutor}>
                        {cabo.condutor}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

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
              value={fields.angulo ?? ''}
              onChange={(e) => {
                if (Number(e.target.value) >= 0 && Number(e.target.value) <= 360) {
                  setFields({ ...fields, angulo: parseFloat(e.target.value) })
                }
              }}
              className="w-full min-w-[80px]"
              placeholder="Entre 0° e 360°"
            />
          </div>

          {fields.tipoDeCaboSelecionado === 'fibra' ? (
            <div className="flex flex-col space-y-1">
              <Label>Porcentagem da Flecha</Label>
              <Select
                onValueChange={(e) => setFields({ ...fields, porcentagemDaFlecha: parseFloat(e) / 100, flecha: null })}
              >
                <SelectTrigger className="w-full min-w-[120px]">
                  <SelectValue placeholder="Selecione a porcentagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gerarValores().map((valor) => (
                      <SelectItem
                        key={valor}
                        value={valor.toString()}
                      >
                        {valor}%
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <Label>Flecha (m)</Label>
              <Input
                type="number"
                placeholder="Flecha em metros"
                disabled={fields.tipoDeCaboSelecionado === 'bt'}
                value={fields.flecha ?? ''}
                onChange={(e) => setFields({ ...fields, flecha: parseFloat(e.target.value), porcentagemDaFlecha: null })}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
