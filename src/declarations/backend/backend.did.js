export const idlFactory = ({ IDL }) => {
  const GetAvailableTokenSupplyResponse = IDL.Record({
    'total_amount' : IDL.Nat8,
    'time' : IDL.Nat64,
  });
  const GetBestOfferResponse = IDL.Record({
    'total_amount' : IDL.Nat64,
    'num_cycles' : IDL.Nat64,
    'amount' : IDL.Nat64,
  });
  const GetBestSolutionResponse = IDL.Record({
    'time' : IDL.Nat64,
    'cur_min_ones' : IDL.Nat8,
  });
  const GetChallengeResponse = IDL.Record({
    'time' : IDL.Nat64,
    'version' : IDL.Nat8,
    'randomness' : IDL.Nat32,
    'min_num_ones' : IDL.Nat8,
    'parent_hash' : IDL.Vec(IDL.Nat8),
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Transaction = IDL.Record({
    'to' : IDL.Principal,
    'fee' : IDL.Nat,
    'from' : IDL.Principal,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Offer = IDL.Record({
    'amount' : IDL.Nat64,
    'num_attached_cycles' : IDL.Nat64,
  });
  const SubmitOfferResponse = IDL.Variant({
    'Rejected' : IDL.Text,
    'Accepted' : IDL.Null,
  });
  const Solution = IDL.Record({
    'principal' : IDL.Opt(IDL.Principal),
    'time' : IDL.Nat64,
    'bytes' : IDL.Vec(IDL.Nat8),
  });
  const SolutionAccepted = IDL.Record({
    'time' : IDL.Nat64,
    'cur_min_ones' : IDL.Nat8,
  });
  const SolutionRejected = IDL.Variant({
    'InvalidSolution' : IDL.Null,
    'ChallengeMismatch' : IDL.Null,
    'Other' : IDL.Text,
  });
  const SubmitSolutionResponse = IDL.Variant({
    'Ok' : SolutionAccepted,
    'Err' : SolutionRejected,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'get_available_token_supply' : IDL.Func(
        [],
        [GetAvailableTokenSupplyResponse],
        [],
      ),
    'get_best_offer' : IDL.Func([], [GetBestOfferResponse], []),
    'get_best_solution' : IDL.Func([], [GetBestSolutionResponse], []),
    'get_challenge' : IDL.Func([], [GetChallengeResponse], []),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc2_balance_of' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'icrc2_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc2_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc2_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc2_transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result_2], []),
    'icrc3_get_account_transactions' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'icrc3_get_transaction' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(Transaction)],
        ['query'],
      ),
    'icrc3_get_transactions' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [Result_1], []),
    'submit_offer' : IDL.Func([Offer], [SubmitOfferResponse], []),
    'submit_solution' : IDL.Func([Solution], [SubmitSolutionResponse], []),
    'upload_wasm_module' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
