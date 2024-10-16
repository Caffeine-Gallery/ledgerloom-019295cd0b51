import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GetAvailableTokenSupplyResponse {
  'total_amount' : number,
  'time' : bigint,
}
export interface GetBestOfferResponse {
  'total_amount' : bigint,
  'num_cycles' : bigint,
  'amount' : bigint,
}
export interface GetBestSolutionResponse {
  'time' : bigint,
  'cur_min_ones' : number,
}
export interface GetChallengeResponse {
  'time' : bigint,
  'version' : number,
  'randomness' : number,
  'min_num_ones' : number,
  'parent_hash' : Uint8Array | number[],
}
export interface Offer { 'amount' : bigint, 'num_attached_cycles' : bigint }
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Solution {
  'principal' : [] | [Principal],
  'time' : bigint,
  'bytes' : Uint8Array | number[],
}
export interface SolutionAccepted { 'time' : bigint, 'cur_min_ones' : number }
export type SolutionRejected = { 'InvalidSolution' : null } |
  { 'ChallengeMismatch' : null } |
  { 'Other' : string };
export type SubmitOfferResponse = { 'Rejected' : string } |
  { 'Accepted' : null };
export type SubmitSolutionResponse = { 'Ok' : SolutionAccepted } |
  { 'Err' : SolutionRejected };
export interface _SERVICE {
  'get_available_token_supply' : ActorMethod<
    [],
    GetAvailableTokenSupplyResponse
  >,
  'get_best_offer' : ActorMethod<[], GetBestOfferResponse>,
  'get_best_solution' : ActorMethod<[], GetBestSolutionResponse>,
  'get_challenge' : ActorMethod<[], GetChallengeResponse>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc2_balance_of' : ActorMethod<[Principal], bigint>,
  'icrc2_decimals' : ActorMethod<[], number>,
  'icrc2_name' : ActorMethod<[], string>,
  'icrc2_symbol' : ActorMethod<[], string>,
  'icrc2_transfer' : ActorMethod<[Principal, bigint], Result_1>,
  'mint' : ActorMethod<[Principal, bigint], Result>,
  'submit_offer' : ActorMethod<[Offer], SubmitOfferResponse>,
  'submit_solution' : ActorMethod<[Solution], SubmitSolutionResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
