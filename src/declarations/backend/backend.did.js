export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'icrc2_balance_of' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'icrc2_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc2_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc2_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc2_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc2_transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result_1], []),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
