import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

type FormType = {
    temperatura: number;
    altitudeMedia: number;
    velocidadeDoVento: number;
    alturaPoste: number;
    esforcoPoste: number;
}

interface AmbienteProps {
    setPressaoDinamicaRef: (value: number) => void;
    setAlturaPoste: (value: number) => void;
    setEsforcoPoste: (value: number) => void;
}

export function AmbienteForm({ setPressaoDinamicaRef, setAlturaPoste, setEsforcoPoste }: AmbienteProps) {
    const [field, setFields] = useState<FormType>({
        altitudeMedia: 70,
        temperatura: 15,
        velocidadeDoVento: 20,
        alturaPoste: 9,
        esforcoPoste: 300
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

    useEffect(() => {
        setEsforcoPoste(field.esforcoPoste)
    }, [field.esforcoPoste])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Dados Gerais
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-6">
                        <Label htmlFor="temperatura">Temperatura coincidente ({field.temperatura}°C)</Label>
                        <Slider
                            defaultValue={[field.temperatura]}
                            min={-20}
                            max={55}
                            step={1}
                            onValueChange={(e) => setFields(state => ({
                                ...state,
                                temperatura: e[0]
                            }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="altitude">Altitude média da região (m)</Label>
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
                        <Label htmlFor="velocidadeDoVento">Velocidade do vento (m/s)</Label>
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
                        <Label>Altura do poste (m)</Label>
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
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="11">11</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Esforço do poste (daN)</Label>
                    <Select
                        defaultValue={field.esforcoPoste.toString()}
                        onValueChange={(value) =>
                            setFields((state) => ({
                                ...state,
                                esforcoPoste: Number(value),
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o esforço do poste" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="150">150</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                            <SelectItem value="900">900</SelectItem>
                            <SelectItem value="1000">1000</SelectItem>
                            <SelectItem value="1500">1500</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}