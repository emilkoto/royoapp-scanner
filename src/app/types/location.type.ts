export interface Location {
  id: number;
  name: string;
  parent?: number;
  children?: Location[];
}

export interface LocationParent {
  id: number;
  name: string;
  parent?: LocationParent | null;
}

export interface CreateLocation {
  name: string;
  parent?: number;
}
