import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor ICRC2Ledger {
    // Token metadata
    private let TOKEN_NAME : Text = "Example Token";
    private let TOKEN_SYMBOL : Text = "EXT";
    private let TOKEN_DECIMALS : Nat8 = 8;
    private let TOKEN_TOTAL_SUPPLY : Nat = 0;

    // Ledger state
    private stable var balances : [(Principal, Nat)] = [];
    private var balancesMap = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    // Initialize the ledger
    private func init() : () {
        balancesMap := HashMap.fromIter<Principal, Nat>(balances.vals(), 1, Principal.equal, Principal.hash);
    };
    init();

    // ICRC-1 and ICRC-2 standard functions

    public query func icrc1_total_supply() : async Nat {
        TOKEN_TOTAL_SUPPLY
    };

    public shared({ caller }) func icrc2_transfer(to : Principal, amount : Nat) : async Result.Result<Nat, Text> {
        let fromBalance = Option.get(balancesMap.get(caller), 0);
        if (fromBalance < amount) {
            return #err("Insufficient balance");
        };

        balancesMap.put(caller, fromBalance - amount);
        let toBalance = Option.get(balancesMap.get(to), 0);
        balancesMap.put(to, toBalance + amount);

        #ok(amount)
    };

    public query func icrc2_balance_of(account : Principal) : async Nat {
        Option.get(balancesMap.get(account), 0)
    };

    public query func icrc2_name() : async Text {
        TOKEN_NAME
    };

    public query func icrc2_symbol() : async Text {
        TOKEN_SYMBOL
    };

    public query func icrc2_decimals() : async Nat8 {
        TOKEN_DECIMALS
    };

    // Helper function to mint tokens (for testing purposes)
    public shared({ caller }) func mint(to : Principal, amount : Nat) : async Result.Result<(), Text> {
        let balance = Option.get(balancesMap.get(to), 0);
        balancesMap.put(to, balance + amount);
        #ok(())
    };

    // New types
    public type GetChallengeResponse = {
        version: Nat8;
        min_num_ones: Nat8;
        time: Nat64;
        randomness: Nat32;
        parent_hash: Blob;
    };

    public type Solution = {
        time: Nat64;
        principal: ?Principal;
        bytes: Blob;
    };

    public type SolutionAccepted = {
        time: Nat64;
        cur_min_ones: Nat8;
    };

    public type SolutionRejected = {
        #InvalidSolution;
        #ChallengeMismatch;
        #Other: Text;
    };

    public type SubmitSolutionResponse = {
        #Ok: SolutionAccepted;
        #Err: SolutionRejected;
    };

    public type GetBestSolutionResponse = {
        time: Nat64;
        cur_min_ones: Nat8;
    };

    public type GetAvailableTokenSupplyResponse = {
        time: Nat64;
        total_amount: Nat8;
    };

    public type Offer = {
        amount: Nat64;
        num_attached_cycles: Nat64;
    };

    public type SubmitOfferResponse = {
        #Accepted;
        #Rejected: Text;
    };

    public type GetBestOfferResponse = {
        amount: Nat64;
        num_cycles: Nat64;
        total_amount: Nat64;
    };

    // New service functions
    public func get_challenge() : async GetChallengeResponse {
        {
            version = 1;
            min_num_ones = 5;
            time = Nat64.fromNat(Int.abs(Time.now()));
            randomness = 12345;
            parent_hash = Blob.fromArray([0,1,2,3,4,5]);
        }
    };

    public func submit_solution(solution: Solution) : async SubmitSolutionResponse {
        #Ok({
            time = Nat64.fromNat(Int.abs(Time.now()));
            cur_min_ones = 6;
        })
    };

    public func get_best_solution() : async GetBestSolutionResponse {
        {
            time = Nat64.fromNat(Int.abs(Time.now()));
            cur_min_ones = 6;
        }
    };

    public func get_available_token_supply() : async GetAvailableTokenSupplyResponse {
        {
            time = Nat64.fromNat(Int.abs(Time.now()));
            total_amount = 100;
        }
    };

    public func submit_offer(offer: Offer) : async SubmitOfferResponse {
        #Accepted
    };

    public func get_best_offer() : async GetBestOfferResponse {
        {
            amount = 1000;
            num_cycles = 5000;
            total_amount = 10000;
        }
    };

    // System functions for upgrades
    system func preupgrade() {
        balances := Iter.toArray(balancesMap.entries());
    };

    system func postupgrade() {
        balances := [];
    };
};
