import { Block } from '@/block';

export interface CanDraw {
  clear(): void;

  drawSidebar(points: number, level: number): void;

  drawNextBlocks(...blocks: Readonly<Block[]>): void;

  drawBlock(block: Readonly<Block>): void;
}
