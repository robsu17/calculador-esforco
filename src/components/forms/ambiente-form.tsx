import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type FormType = {
    temperatura: number;
    altitudeMedia: number;
    velocidadeDoVento: number;
    alturaPoste: number;
}

interface AmbienteProps {
    setPressaoDinamicaRef: (value: number) => void;
    setAlturaPoste: (value: number) => void;
}

export function AmbienteForm({ setPressaoDinamicaRef, setAlturaPoste }: AmbienteProps) {
    const [field, setFields] = useState<FormType>({
        altitudeMedia: 70,
        temperatura: 15,
        velocidadeDoVento: 20,
        alturaPoste: 9
    });


    const calculaPressaoDinamicaRef = () => {
        const massaEspecificaAr = (1.293 / (1 + 0.00367 * field.temperatura)) * ((16000 + (64 * field.temperatura) - field.altitudeMedia) / ((16000 + (64 * field.temperatura) + field.altitudeMedia)))
        const pressaoDinamica = (massaEspecificaAr * (field.velocidadeDoVento ** 2)) / 2
        setPressaoDinamicaRef(pressaoDinamica / 10)
    }

    useEffect(() => {
        calculaPressaoDinamicaRef()
    }, [field])

    useEffect(() => {
        setAlturaPoste(field.alturaPoste)
    }, [field.alturaPoste])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Ambiente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="temperatura">Temperatura coincidente em (°C)</Label>
                        <Input
                            id="temperatura"
                            type="number"
                            defaultValue={field.temperatura}
                            onChange={(e) => setFields(state => ({
                                ...state,
                                temperatura: Number(e.target.value)
                            }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="altitude">Altitude média da região em (m)</Label>
                        <Input
                            id="altitude"
                            type="number"
                            defaultValue={field.altitudeMedia}
                            onChange={(e) => setFields(state => ({
                                ...state,
                                altitudeMedia: Number(e.target.value)
                            }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="velocidadeDoVento">Velocidade do vento em m/s</Label>
                        <Input
                            id="velocidadeDoVento"
                            type="number"
                            defaultValue={field.velocidadeDoVento}
                            onChange={(e) => setFields((state) => ({
                                ...state,
                                velocidadeDoVento: Number(e.target.value)
                            }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Altura do poste</Label>
                        <Select
                            defaultValue="9" // aqui você define o valor inicial selecionado
                            onValueChange={(value) =>
                                setFields((state) => ({
                                    ...state,
                                    alturaPoste: Number(value),
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a altura do poste" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="8">8 metros</SelectItem>
                                <SelectItem value="9">9 metros</SelectItem>
                                <SelectItem value="10">10 metros</SelectItem>
                                <SelectItem value="11">11 metros</SelectItem>
                                <SelectItem value="12">12 metros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}