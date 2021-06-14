import { Block } from '@/block';
import { CanDraw } from '@/types/can-draw.interface';
interface RendererConfig {
    blocksCount: number;
    backgroundColor: string;
    fieldLength: number;
    borderColor: string;
    length: number;
}
interface TranslatePositionOptions {
    marginLeft: number;
    marginTop: number;
}
export declare class CanvasRenderer implements CanDraw {
    private readonly context;
    private blockLength;
    private blockBorderWidth;
    private readonly config;
    constructor(context: CanvasRenderingContext2D, config?: Partial<RendererConfig>);
    private translatePosition;
    private get sidebarParameters();
    clear(): void;
    drawSidebar(points: number, level: number): void;
    drawNextBlocks(...blocks: Readonly<Block[]>): void;
    drawBlock(block: Readonly<Block>, translateOptions?: Readonly<TranslatePositionOptions>): void;
}
export {};
