export interface SignalKDelta {
  readonly context: string,
  readonly updates: SignalKUpdate[]
}

export interface SignalKUpdate {
  readonly timestamp: Date,
  readonly values: SignalKValue[]
}

export interface SignalKValue {
  readonly path: string,
  readonly value: Position
}

export interface Position {
  longitude: number,
  latitude: number
}
