
import bs58 from 'bs58'

function secretKeyToUint8Array(secretKeyString: string): Uint8Array {
    // If the string is base58 encoded
    try {
        return bs58.decode(secretKeyString);
    } catch (e) {
        // If the string is a comma-separated number array
        const numbers = secretKeyString
            .replace(/[\[\]\s]/g, '')  // Remove brackets and whitespace
            .split(',')
            .map(num => parseInt(num));
        return new Uint8Array(numbers);
    }
}

export const configLines = [
    { name: 'Abdoulaye Ndiaye', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/abdoulaye_ndiaye.json' },
    { name: 'Adewale Oniru', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/adewale_oniru.json' },
    { name: 'Ahmad Putra', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/ahmad_putra.json' },
    { name: 'Ahmed Mahmoud', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/ahmed_mahmoud.json' },
    { name: 'Ali Hassan', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/ali_hassan.json' },
    { name: 'Ali Khan', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/ali_khan.json' },
    { name: 'Andrew MacDonald', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/andrew_macdonald.json' },
    { name: 'Carlos Pérez', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/carlos_pérez.json' },
    { name: 'Didier Koné', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/didier_koné.json' },
    { name: 'Dylan Evans', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/dylan_evans.json' },
    { name: 'Hiroshi Tanaka', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/hiroshi_tanaka.json' },
    { name: 'James Smith', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/james_smith.json' },
    { name: 'João Silva', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/joão_silva.json' },
    { name: 'José Rodríguez', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/josé_rodríguez.json' },
    { name: 'Juan Dela Cruz', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/juan_dela_cruz.json' },
    { name: 'Kwame Boateng', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/kwame _boateng.json' },
    { name: 'Li Wei', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/li_wei.json' },
    { name: 'Liam O\'Connor', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/liam_o_connor.json' },
    { name: 'Luis Fernández', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/luis_fernández.json' },
    { name: 'Martín Gómez', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/martín_gómez.json' },
    { name: 'Petrus Shivute', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/petrus_shivute.json' },
    { name: 'Rami Samir Al-Khoury', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/rami_samir _al-khoury.json' },
    { name: 'Saeed Khalifa Al-Nahyan', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/saeed_khalifa _al-nahyan.json' },
    { name: 'William Tank', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/william_tank.json' },
    { name: 'Yassine Abdelhak El-Fassi', uri: 'https://aifuu.s3.eu-west-2.amazonaws.com/playerJson/yassine_abdelhak _el-fassi.json' },
];

export default {
    signer: secretKeyToUint8Array(Bun.env.SIGNER as string),
}
