export interface TetrisConfig {
  backgroundColor: string;
  borderColor: string;
  blocksCount: number;
  scoreMap: Record<1 | 2 | 3 | 4, number>;
}
