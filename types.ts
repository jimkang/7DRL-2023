import { Body } from 'matter-js';
import { SynthNode } from './synths/synth-node';

export interface ScoreState {
  events: ScoreEvent[];
  tickIndex: number;
  tickLength: number;
  meta?: EventMetadata;
}

export interface Loop {
  loopStartSeconds: number;
  loopEndSeconds: number;
}

export interface ScoreEvent {
  rate: number;
  delay: number;
  peakGain: number;
  pan?: number;
  fadeLength?: number;

  // By default, it is assumed that ScoreEvent will always be using the same sample.
  // variableSampleIndex allows the specification of different samples per event.
  variableSampleIndex?: number;
  loop?: Loop;
  meta?: EventMetadata;
  rest?: boolean;
}

export interface EventMetadata {
  chordPitchCount?: number;
  sourceDatum?;
}

export interface PlayEvent {
  scoreEvent: ScoreEvent;
  nodes: SynthNode[];
  started: boolean;
  rest?: boolean;
}

export type Pair = number[];
export interface Pt {
  x: number;
  y: number;
}
export interface BoxSize {
  width: number;
  height: number;
}
export type Box = Pt & BoxSize;

export interface QueueItem {
  initiative: number;
}

export interface QueueCallback extends QueueItem {
  callback;
  params?;
}

export interface SoulBase {
  kind: string;
  tags: string[];
  // eslint-disable-next-line no-unused-vars
  pickActions?: (self: Soul, addCommand: (queueCmd: QueueCmd) => void) => void;
  // actionSet
  //collisionTag: string;
  collisionMask?: number;
  collisionCategory?: number;
  collisionGroup?: number;
  vertices: Pt[];
  verticesBox: Box;
  svgScale?: number;
  verticesScale?: number;
  slop?: number;
  rotation?: number;
  layer: string;
}

export interface SoulDef extends SoulBase {
  svgSrcForDirections: Record<string, string>;
}

export interface Soul extends SoulBase {
  id: string;
  svgsForDirections: Record<string, SVGPathElement[]>;
  body: Body;
  destination: Pt;
  holdings: Soul[];
  actions: Action[];
}

export interface SoulDefSpot {
  pos: Pt;
  def: SoulDef;
}

export type SoulDefMap = SoulDefSpot[];

export interface SoulSpot {
  pos: Pt;
  soul: Soul;
}

export interface Action {
  name: string;
  id: string;
  cmd: ActionCmd;
}

export interface ActionParams {
  name: string; // Is this needed?
  id: string;
  actors: Soul[];
  existingSouls: Soul[];
  also?;
}

export interface ActionCmd {
  fn: ActionFn;
  actors: Soul[];
  also?;
}

export interface QueueCmd extends QueueItem {
  cmd: ActionCmd;
}

// eslint-disable-next-line no-unused-vars
export type ActionFn = (actionParams: ActionParams) => Promise<void>;
