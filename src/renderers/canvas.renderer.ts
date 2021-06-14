import { Block } from '@/block';
import { Position } from '@/position';
import { Color } from '@/support/color.support';
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

const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  fieldLength: 400,
  length: 650,
  blocksCount: 10,
  backgroundColor: '#112233',
  borderColor: '#660099',
};

const DEFAULT_TRANSLATE_POSITION_OPTIONS: TranslatePositionOptions = { marginLeft: 0, marginTop: 0 };

export class CanvasRenderer implements CanDraw {
  private blockLength: number;

  private blockBorderWidth: number;

  private readonly config: RendererConfig;

  constructor(private readonly context: CanvasRenderingContext2D, config?: Partial<RendererConfig>) {
    this.config = { ...DEFAULT_RENDERER_CONFIG, ...(config || {}) };

    this.blockLength = this.config.fieldLength / this.config.blocksCount;
    this.blockBorderWidth = this.blockLength * 0.1;
  }

  private translatePosition(position: Readonly<Position>, options: Readonly<TranslatePositionOptions>): Position {
    return new Position(
      position.x * this.blockLength + options.marginLeft,
      position.y * this.blockLength + options.marginTop,
    );
  }

  private get sidebarParameters() {
    const width = this.config.length - this.config.fieldLength;
    const x = this.config.fieldLength;
    const padding = (width - 4 * this.blockLength) / 2;
    const height = this.config.fieldLength * 2;
    const scoreY = height / 2;

    return {
      x,
      y: 0,
      width,
      height,
      padding,
      scoreX: x + padding,
      scoreY,
      pointsX: x + padding,
      pointsY: (height * 3) / 4,
    };
  }

  public clear(): void {
    this.context.fillStyle = this.config.backgroundColor;
    const { length } = this.config;
    this.context.fillRect(0, 0, length, length * 2);
  }

  public drawSidebar(points: number, level: number): void {
    const { backgroundColor } = this.config;
    const { x, y, width: sidebarWidth, padding, height, scoreX, scoreY, pointsX, pointsY } = this.sidebarParameters;

    this.context.save();

    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect(x, y, sidebarWidth, height);

    this.context.fillStyle = backgroundColor;
    this.context.font = '30px sans-serif';
    this.context.fillText('Next figure', x + padding, y + padding);

    this.context.fillText('Scores', scoreX, scoreY);
    this.context.fillText(`${points}`, scoreX + 45, scoreY + 45);

    this.context.fillText('Level', pointsX, pointsY);
    this.context.fillText(`${level}`, pointsX + 45, pointsY + 45);

    this.context.restore();
  }

  public drawNextBlocks(...blocks: Readonly<Block[]>): void {
    const { x, y, padding } = this.sidebarParameters;

    blocks.forEach((block) => {
      this.drawBlock(block, { marginLeft: x + padding, marginTop: y + 2 * padding });
    });
  }

  public drawBlock(
    block: Readonly<Block>,
    translateOptions: Readonly<TranslatePositionOptions> = DEFAULT_TRANSLATE_POSITION_OPTIONS,
  ): void {
    const { context } = this;
    const { blockLength: l, blockBorderWidth: bw } = this;
    const { x, y } = this.translatePosition(block.position.round(), translateOptions);

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
