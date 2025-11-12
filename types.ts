export type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1';

export interface OverlayTransform {
  scaleX: number;
  scaleY: number;
  position: { x: number; y: number };
}

export interface AppState {
  generatedImage: string | null;
  transform: OverlayTransform;
}

export interface Template {
  id: string;
  name: string;
  prompt: string;
  styleKeywords: string[];
}

export interface Layer {
  id: string;
  name?: string;
  isVisible: boolean;
  opacity?: number;
  generatedImage?: string;
  transform?: OverlayTransform;
}
