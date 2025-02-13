export interface Location {
  id: number;
  name: string;
  parent?: number;
  children?: Location[];
  color?: string;
  readonly display_color?: string;
}

export interface LocationParent {
  id: number;
  name: string;
  parent?: LocationParent | null;
  color?: string;
  readonly display_color?: string;
}

export interface CreateLocation {
  name: string;
  parent?: number;
}
