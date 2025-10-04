import { CaboFormField } from './forms/cabo-form';
import { ResultadoFinal } from '../App';

interface DiagramaPosteProps {
    caboForms: CaboFormField[];
    resultadoFinal: ResultadoFinal;
    esforcosCabo: { [key: string]: { esforcoTotal: number; esforcoRefletidoX: number; esforcoRefletidoY: number } };
    esforcoPoste: number;
}

export function DiagramaPoste({ caboForms, resultadoFinal, esforcosCabo, esforcoPoste }: DiagramaPosteProps) {
    const svgSize = 400;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;

    // Escala: eixo de 150px = 200m de vão
    const escalaMetrosPorPixel = 200 / 150; // 1.33 metros por pixel
    const maxForceLength = 100; // Comprimento máximo dos vetores de força

    // Função para converter graus para radianos
    const grausParaRadianos = (graus: number) => graus * (Math.PI / 180);

    // Função para calcular o comprimento do vetor de força (proporcional ao esforço)
    const calcularComprimentoVetor = (esforco: number, maxEsforco: number) => {
        if (maxEsforco === 0) return 0;
        return (esforco / maxEsforco) * maxForceLength;
    };

    // Encontrar o esforço máximo para normalizar os vetores
    const esforcosRefletidos = Object.values(esforcosCabo).map(e =>
        Math.sqrt(e.esforcoRefletidoX ** 2 + e.esforcoRefletidoY ** 2)
    );
    const maxEsforcoRefletido = Math.max(...esforcosRefletidos, resultadoFinal.esforcoResultante);

    // Cores para diferentes cabos - melhoradas para contraste
    const coresCabo = ['#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777'];

    const esforcoPosteConclusao = () => {
        if (esforcoPoste > resultadoFinal.esforcoResultante) {
            return 'Conclusão: Esforço resultante é menor do que o esforço do poste, portanto o poste está adequado.'
        } else {
            return 'Conclusão: Esforço resultante é maior do que o esforço do poste, portanto o poste não está adequado.'
        }
    }

    return (
        <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                📐 Diagrama de Forças
            </h3>

            <div className="flex justify-center">
                <svg width={svgSize} height={svgSize} className="border border-gray-200 rounded-md bg-white">
                    {/* Grade técnica quadriculada */}
                    <defs>
                        <pattern id="technical-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#technical-grid)" />

                    {/* Poste - Vista Superior (Planta Baixa) */}
                    <g>
                        {/* Base circular do poste (vista de cima) */}
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r="4"
                            fill="#2d3748"
                            stroke="#1a202c"
                            strokeWidth="1"
                        />

                        {/* Cruz de referência do poste */}
                        <line
                            x1={centerX - 8}
                            y1={centerY}
                            x2={centerX + 8}
                            y2={centerY}
                            stroke="#4a5568"
                            strokeWidth="2"
                        />
                        <line
                            x1={centerX}
                            y1={centerY - 8}
                            x2={centerX}
                            y2={centerY + 8}
                            stroke="#4a5568"
                            strokeWidth="2"
                        />

                        {/* Texto "POSTE" */}
                        <text
                            x={centerX}
                            y={centerY + 4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-white"
                        >
                            {/* POSTE */}
                        </text>
                    </g>

                    {/* Desenhar cabos e suas forças */}
                    {caboForms.map((caboForm, index) => {
                        const caboKey = `${caboForm.tipoDeCabo}_${index}`;
                        const esforcoData = esforcosCabo[caboKey];

                        if (!esforcoData) return null;

                        const anguloRad = grausParaRadianos(caboForm.angulo);

                        // Calcular comprimento do cabo baseado no vão real
                        const vaoMetros = caboForm.vao; // Vão em metros
                        const comprimentoCaboPixels = vaoMetros / escalaMetrosPorPixel;

                        // Calcular comprimento do vetor de força proporcional ao esforço
                        const esforcoTotal = Math.sqrt(esforcoData.esforcoRefletidoX ** 2 + esforcoData.esforcoRefletidoY ** 2);
                        const comprimentoVetor = calcularComprimentoVetor(esforcoTotal, maxEsforcoRefletido);

                        // Pontos de conexão no poste (vista superior)
                        const startX = centerX; // Centro do poste
                        const startY = centerY; // Centro do poste

                        // Usar o comprimento real do cabo para posicionamento
                        const endX = startX + Math.cos(anguloRad) * comprimentoCaboPixels;
                        const endY = startY - Math.sin(anguloRad) * comprimentoCaboPixels; // Invertido para convenção matemática

                        const cor = coresCabo[index % coresCabo.length];

                        return (
                            <g key={index}>
                                {/* Linha do cabo (comprimento real baseado no vão) */}
                                <line
                                    x1={startX}
                                    y1={startY}
                                    x2={endX}
                                    y2={endY}
                                    stroke={cor}
                                    strokeWidth="3"
                                    opacity="0.8"
                                />

                                {/* Vetor de força (comprimento proporcional ao esforço) */}
                                {/* <line
                                    x1={startX}
                                    y1={startY}
                                    x2={startX + Math.cos(anguloRad) * comprimentoVetor}
                                    y2={startY - Math.sin(anguloRad) * comprimentoVetor}
                                    stroke={cor}
                                    strokeWidth="5"
                                /> */}

                            </g>
                        );
                    })}

                    {/* Força resultante */}
                    {resultadoFinal.esforcoResultante > 0 && (
                        <g>
                            <line
                                x1={centerX}
                                y1={centerY}
                                x2={centerX + (resultadoFinal.esforcoResultanteX / maxEsforcoRefletido) * maxForceLength}
                                y2={centerY - (resultadoFinal.esforcoResultanteY / maxEsforcoRefletido) * maxForceLength}
                                stroke="#dc2626"
                                strokeWidth="7"
                                strokeDasharray="3,3"
                            />

                        </g>
                    )}

                    {/* Eixos de referência do plano cartesiano */}
                    <line
                        x1={centerX - 150}
                        y1={centerY}
                        x2={centerX + 150}
                        y2={centerY}
                        stroke="#6b7280"
                        strokeWidth="3"
                        strokeDasharray="2,2"
                    />
                    <line
                        x1={centerX}
                        y1={centerY - 150}
                        x2={centerX}
                        y2={centerY + 150}
                        stroke="#6b7280"
                        strokeWidth="3"
                        strokeDasharray="2,2"
                    />

                    {/* Labels dos eixos */}
                    <text x={centerX + 160} y={centerY - 8} className="text-base font-bold fill-gray-700">X</text>
                    <text x={centerX + 8} y={centerY - 160} className="text-base font-bold fill-gray-700">Y</text>

                </svg>
            </div>

            {/* Legenda */}
            <div className="mt-3 space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Legenda:</div>
                <div className="space-y-2">
                    {/* Cabos */}
                    {caboForms.map((caboForm, index) => {
                        const caboKey = `${caboForm.tipoDeCabo}_${index}`;
                        const esforcoData = esforcosCabo[caboKey];
                        const cor = coresCabo[index % coresCabo.length];

                        if (!esforcoData) return null;

                        const esforcoTotal = Math.sqrt(esforcoData.esforcoRefletidoX ** 2 + esforcoData.esforcoRefletidoY ** 2);

                        return (
                            <div key={index} className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-1 rounded"
                                        style={{ backgroundColor: cor }}
                                    />
                                    <span className="text-gray-600">
                                        {caboForm.tipoDeCabo.split('-')[2]} ({caboForm.angulo}°) - {caboForm.vao}m
                                    </span>
                                </div>
                                <span className="font-medium text-gray-800">
                                    {esforcoTotal.toFixed(1)} N
                                </span>
                            </div>
                        );
                    })}

                    {/* Força resultante */}
                    {resultadoFinal.esforcoResultante > 0 && (
                        <div className="flex items-center justify-between gap-2 text-xs border-t pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 rounded bg-red-600" />
                                <span className="text-gray-600 font-bold">Força Resultante</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-800">
                                    {resultadoFinal.esforcoResultante.toFixed(1)} N
                                </div>
                                <div className="text-gray-600">
                                    {resultadoFinal.anguloResultante.toFixed(1)}°
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <div>
                    {
                        resultadoFinal.anguloResultante > 0
                        && esforcoPosteConclusao()
                    }
                </div>
            </div>
        </div>
    );
}