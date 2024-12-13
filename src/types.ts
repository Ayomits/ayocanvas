
export type FontsType = {
    path: string;
    fontName: string;
  };
  export type ColorStopType = {
    offset: number;
    color: any;
  };
  
  export type GradientType = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    colorStops: ColorStopType[];
    type: "linear" | "radial";
  };
  export type CanvasOptionsMetaDataType = {
    x: number;
    y: number;
    image?: {
      url: string;
      width: number;
      height: number;
      isRounded?: boolean;
    };
    text?: {
      maxWidth?: number;
      font?: string;
      color?: string;
      gradient?: GradientType;
      value: string;
      stroke?: string;
    };
    progressBar?: {
      width: number;
      height: number;
      color: string;
      stroke?: string;
      isRound?: boolean
      gradient?: GradientType;
    };
  };
  export type CanvasKeyValueType = { [key: string]: CanvasOptionsMetaDataType };
  export type CanvasOptionsType = {
    width: number;
    height: number;
    globalFont?: string;
    globalColor?: string;
    background?: string;
    requiredFonts?: FontsType[];
    elements?: CanvasKeyValueType[];
  };
  