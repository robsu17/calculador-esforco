type Cabo = {
    name: string;
    weight: number;
    diameter: number;
}

export const cabosFibra: Cabo[] = [
    {
        name: 'CFOA-SM-AS200-12F',
        weight: 0.070,
        diameter: 0.0098
    },
    {
        name: 'CFOA-SM-AS120-12F',
        weight: 0.063,
        diameter: 0.0082
    },
    {
        name: 'CFOA-SM-AS80-12F',
        weight: 0.042,
        diameter: 0.0068
    },
    {
        name: 'Cordoalha',
        weight: 0.030,
        diameter: 0.006
    }
];

export const cabosBT: Cabo[] = [
    {
        name: "3x35+1x54,6",
        diameter: 0.037,
        weight: 0.7
    },
    {
        name: "3x50+1x54,6",
        diameter: 0.037,
        weight: 0.765
    },
    {
        name: "3x95+1x54,6",
        diameter: 0.043,
        weight: 1.27
    },
    {
        name: "3x150+1x80",
        diameter: 0.051,
        weight: 1.878
    }
];

export const cabosMT: Cabo[] = [
    {
        name: "4AWG CAA ou 4AWG CAA/AW",
        diameter: 0.00636,
        weight: 0.0855
    },
    {
        name: "1/0AWG CAA ou 1/0AWG CAA/AW",
        diameter: 0.01011,
        weight: 0.2161
    },
    {
        name: "2/0AWG CAA",
        diameter: 0.01134,
        weight: 0.2718
    },
];