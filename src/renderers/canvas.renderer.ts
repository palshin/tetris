import { Block } from '@/block';
import { Position } from '@/types/position.interface';
import { Color } from '@/support/color.support';

interface RendererConfig {
  blocksCount: number;
  backgroundColor: string;
  length: number;
  borderColor: string;
}

const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  length: 500,
  blocksCount: 10,
  backgroundColor: '#112233',
  borderColor: '#FFFFFF',
};

const CANVAS_PADDING = 10;

export class CanvasRenderer {
  private blockLength: number;

  private blockBorderWidth: number;

  private readonly config: RendererConfig;

  constructor(readonly context: CanvasRenderingContext2D, config?: Partial<RendererConfig>) {
    this.config = { ...DEFAULT_RENDERER_CONFIG, ...(config || {}) };

    this.blockLength = this.config.length / this.config.blocksCount;
    this.blockBorderWidth = this.blockLength * 0.1;
  }

  private translatePosition(position: Readonly<Position>): Position {
    return {
      x: position.x * this.blockLength,
      y: position.y * this.blockLength,
    };
  }

  clear(): void {
    this.context.fillStyle = this.config.backgroundColor;
    const { length } = this.config;
    this.context.fillRect(0, 0, length, length);
  }

  drawStage(): void {
    this.context.strokeStyle = this.config.borderColor;
    const { length: l, blocksCount } = this.config;

    // draw game field
    this.context.strokeRect(l / 4, 0, blocksCount * this.blockLength, blocksCount * 2 * this.blockLength);

    // draw next figure container
    this.context.strokeRect(
      (l * 3) / 4 + CANVAS_PADDING * 2,
      CANVAS_PADDING,
      l / 4 - CANVAS_PADDING * 4,
      l / 4 - CANVAS_PADDING * 4,
    );
  }

  drawBlock(block: Readonly<Block>): void {
    const { context } = this;
    const { blockLength: l, blockBorderWidth: bw } = this;
    const { x, y } = this.translatePosition(block.position);

    context.save();

    // draw block
    context.fillStyle = block.color;
    context.fillRect(x, y, l, l);

    // draw shadows (or borders)

    // top and left shadows
    context.fillStyle = Color.lightness(block.color, 20);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + l, y);
    context.lineTo(x + l - bw, y + bw);
    context.lineTo(x + bw, y + bw);
    context.fill();

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + l);
    context.lineTo(x + bw, y + l - bw);
    context.lineTo(x + bw, y + bw);
    context.fill();

    // right and bottom shadows
    context.fillStyle = Color.lightness(block.color, -20);
    context.beginPath();
    context.moveTo(x + l, y);
    context.lineTo(x + l, y + l);
    context.lineTo(x + l - bw, y + l - bw);
    context.lineTo(x + l - bw, y + bw);
    context.fill();

    context.beginPath();
    context.moveTo(x + l, y + l);
    context.lineTo(x, y + l);
    context.lineTo(x + bw, y + l - bw);
    context.lineTo(x + l - bw, y + l - bw);
    context.fill();

    context.restore();
  }
}
