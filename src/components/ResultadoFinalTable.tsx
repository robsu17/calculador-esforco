import { ResultadoFinal } from "@/App";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ResultadoFinalTableProps {
    dados: ResultadoFinal
}

export function ResultadoFinalTable({ dados }: ResultadoFinalTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Esforço Resultante</TableHead>
                    {/* <TableHead>Esforço Resultante X</TableHead> */}
                    {/* <TableHead>Esforço Resultante Y</TableHead> */}
                    <TableHead>Ângulo Resultante</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>{dados.esforcoResultante.toFixed(1)} daN</TableCell>
                    {/* <TableCell>{dados.esforcoResultanteX}</TableCell> */}
                    {/* <TableCell>{dados.esforcoResultanteY}</TableCell> */}
                    <TableCell>{Math.round(dados.anguloResultante)}°</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}