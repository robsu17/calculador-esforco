import { tiposDeCabos } from "@/data/cabos";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function CaboForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cabos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-3">
                        <Label>Tipo do cabo</Label>
                        <Select>
                            <SelectTrigger>Tipo de cabo</SelectTrigger>
                            <SelectContent className="w-full">
                                {tiposDeCabos.map((cabo) => <SelectItem key={cabo} value={cabo}>{cabo}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3">
                        <Label>Vão em (m)</Label>
                        <Input />
                    </div>

                    <div className="space-y-3">
                        <Label>Ângulo</Label>
                        <Input />
                    </div>

                    <div className="space-y-3">
                        <Label>Flecha</Label>
                        <Input />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}