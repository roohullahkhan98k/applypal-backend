export declare class WidgetConfigDto {
    selectedIcons?: string[];
    iconInputs?: {
        [key: string]: {
            label?: string;
            url?: string;
        };
    };
    selectedColor?: string;
    universityId?: string;
}
export declare class WidgetResponseDto {
    iframeCode: string;
    iframeFormats: {
        html: string;
        react: string;
        vue: string;
        angular: string;
        wordpress: string;
        shopify: string;
    };
    previewUrl: string;
    widgetId: string;
}
