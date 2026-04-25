export interface LevelProps {
  onSolve: () => void;
}

export interface LevelDef {
  id: string;
  name: string;
  Component: React.ComponentType<LevelProps>;
}
