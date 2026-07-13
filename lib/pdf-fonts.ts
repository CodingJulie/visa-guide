import { Font } from '@react-pdf/renderer';

const PDF_FONT_FAMILY = 'Roboto';

let fontsRegistered = false;

export function ensurePdfFontsRegistered(): void {
    if (fontsRegistered) return;

    Font.register({
        family: PDF_FONT_FAMILY,
        fonts: [
            { src: '/fonts/Roboto-Regular.ttf', fontWeight: 400 },
            { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
        ],
    });

    fontsRegistered = true;
}

export const pdfFontFamily = PDF_FONT_FAMILY;
