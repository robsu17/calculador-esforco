type Cabo = {
    name: string;
    weight: number;
    diameter: number;
}

type CaboBT = {
    condutor: string;
    diametro: number;
    massa: number;
}

type CaboMT = {
    bitola: string;
    diametro: number;
    massa: number;
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

export const cabosBT: CaboBT[] = [
    {
        condutor: "3x35+1x54,6",
        diametro: 0.037,
        massa: 0.7
    },
    {
        condutor: "3x50+1x54,6",
        diametro: 0.037,
        massa: 0.765
    },
    {
        condutor: "3x95+1x54,6",
        diametro: 0.043,
        massa: 1.27
    },
    {
        condutor: "3x150+1x80",
        diametro: 0.051,
        massa: 1.878
    }
];

export const cabosMT: CaboMT[] = [
    {
        bitola: "4AWG CAA ou 4AWG CAA/AW",
        diametro: 0.00636,
        massa: 0.0855
    },
    {
        bitola: "1/0AWG CAA ou 1/0AWG CAA/AW",
        diametro: 0.01011,
        massa: 0.2161
    },
    {
        bitola: "2/0AWG CAA",
        diametro: 0.01134,
        massa: 0.2718
    },
    {
        bitola: "266,8MCM CAA ou 266,8MCM CAA/AW",
        diametro: 0.01628,
        massa: 0.5445
    },
    {
        bitola: "336,4MCM CAA",
        diametro: 0.01831,
        massa: 0.6887
    }
];