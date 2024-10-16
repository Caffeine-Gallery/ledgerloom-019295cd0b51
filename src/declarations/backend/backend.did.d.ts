import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc2_balance_of' : ActorMethod<[Principal], bigint>,
  'icrc2_decimals' : ActorMethod<[], number>,
  'icrc2_name' : ActorMethod<[], string>,
  'icrc2_symbol' : ActorMethod<[], string>,
  'icrc2_transfer' : ActorMethod<[Principal, bigint], Result_1>,
  'mint' : ActorMethod<[Principal, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
