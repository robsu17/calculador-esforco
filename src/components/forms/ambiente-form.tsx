import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormType = {
    temperatura: number;
    altitudeMedia: number;
    velocidadeDoVento: number;
}

interface AmbienteProps {
    setMassaEspecificaAr: (value: number) => void;
}

export function AmbienteForm({ setMassaEspecificaAr }: AmbienteProps) {
    const [field, setFields] = useState<FormType>({
        altitudeMedia: 70,
        temperatura: 15,
        velocidadeDoVento: 20
    });


    const calculaTracaoInicial = () => {
        const massaEspecificaAr = (1.293 / (1 + 0.00367 * field.temperatura)) * ((16000 + (64 * field.temperatura) - field.altitudeMedia) / ((16000 + (64 * field.temperatura) + field.altitudeMedia)))
        setMassaEspecificaAr(massaEspecificaAr)
    }

    useEffect(() => {
        calculaTracaoInicial()
    }, [field])

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
            </CardContent>
        </Card>
    )
}