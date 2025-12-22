export * from './types.js';
import { type AnyDataset } from './types.js';
export declare const datasets: Record<string, AnyDataset>;
export type DatasetKey = keyof typeof datasets;
/**
 * Get the dataFields for a specific dataset
 */
export declare function getDataFieldsForDataset(datasetId: string): import("./types.js").DataFieldOption[];
/**
 * Find fields in a template that don't exist in the target dataset
 */
export declare function findUnmappedFields(templateFields: string[], targetDatasetId: string): string[];
export declare const templates: {
    readonly default: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        template: {
            name: string;
            components: ({
                id: string;
                type: string;
                props: {
                    colors: string[];
                    direction: string;
                    dataField?: undefined;
                    x?: undefined;
                    y?: undefined;
                    width?: undefined;
                    height?: undefined;
                    fit?: undefined;
                    clipRadius?: undefined;
                    fontSize?: undefined;
                    fontWeight?: undefined;
                    fill?: undefined;
                    textAnchor?: undefined;
                    multiline?: undefined;
                    stroke?: undefined;
                    strokeWidth?: undefined;
                    radius?: undefined;
                };
            } | {
                id: string;
                type: string;
                props: {
                    dataField: string;
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                    fit: string;
                    clipRadius: number;
                    colors?: undefined;
                    direction?: undefined;
                    fontSize?: undefined;
                    fontWeight?: undefined;
                    fill?: undefined;
                    textAnchor?: undefined;
                    multiline?: undefined;
                    stroke?: undefined;
                    strokeWidth?: undefined;
                    radius?: undefined;
                };
            } | {
                id: string;
                type: string;
                props: {
                    dataField: string;
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                    fontSize: number;
                    fontWeight: string;
                    fill: string;
                    textAnchor: string;
                    colors?: undefined;
                    direction?: undefined;
                    fit?: undefined;
                    clipRadius?: undefined;
                    multiline?: undefined;
                    stroke?: undefined;
                    strokeWidth?: undefined;
                    radius?: undefined;
                };
            } | {
                id: string;
                type: string;
                props: {
                    dataField: string;
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                    fontSize: number;
                    fontWeight: string;
                    fill: string;
                    textAnchor: string;
                    multiline: boolean;
                    colors?: undefined;
                    direction?: undefined;
                    fit?: undefined;
                    clipRadius?: undefined;
                    stroke?: undefined;
                    strokeWidth?: undefined;
                    radius?: undefined;
                };
            } | {
                id: string;
                type: string;
                props: {
                    stroke: string;
                    strokeWidth: number;
                    radius: number;
                    colors?: undefined;
                    direction?: undefined;
                    dataField?: undefined;
                    x?: undefined;
                    y?: undefined;
                    width?: undefined;
                    height?: undefined;
                    fit?: undefined;
                    clipRadius?: undefined;
                    fontSize?: undefined;
                    fontWeight?: undefined;
                    fill?: undefined;
                    textAnchor?: undefined;
                    multiline?: undefined;
                };
            })[];
        };
    };
};
