import { DocumentScanner } from ".";
declare let DDV: any;
export declare function setDDV(DocumentViewer: any): void;
export declare class OpenCVDocumentDetectHandler extends DDV.DocumentDetect {
    private documentScanner;
    constructor(documentScanner: DocumentScanner);
    detect(image: any, detectConfig: any): Promise<any>;
    compress(imageData: any, imageWidth: number, imageHeight: number, newWidth: number, newHeight: number): Uint8ClampedArray | Uint8Array;
}
export {};
