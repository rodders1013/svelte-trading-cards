export interface MeasureTextOptions {
    fontWeight?: string;
    fontStyle?: string;
}
export declare function measureText(text: string, fontFamily: string, fontSize: number, options?: MeasureTextOptions): number;
