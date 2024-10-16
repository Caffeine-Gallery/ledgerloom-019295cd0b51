use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::time;
use ic_cdk::export::candid;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::{HashMap, HashSet};

// Token metadata
const TOKEN_NAME: &str = "Example Token";
const TOKEN_SYMBOL: &str = "EXT";
const TOKEN_DECIMALS: u8 = 8;
const TOKEN_TOTAL_SUPPLY: u128 = 0;

// Ledger state
thread_local! {
    static BALANCES: RefCell<HashMap<Principal, u128>> = RefCell::new(HashMap::new());
    static TRANSACTIONS: RefCell<Vec<Transaction>> = RefCell::new(Vec::new());
    static STORED_WASM_MODULE: RefCell<Option<Vec<u8>>> = RefCell::new(None);
    static MAINTAINERS: RefCell<HashSet<Principal>> = RefCell::new(HashSet::new());
    static PROPOSALS: RefCell<HashMap<u128, Proposal>> = RefCell::new(HashMap::new());
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Transaction {
    timestamp: i64,
    from: Principal,
    to: Principal,
    amount: u128,
    fee: u128,
    memo: Option<Vec<u8>>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct GetChallengeResponse {
    version: u8,
    min_num_ones: u8,
    time: u64,
    randomness: u32,
    parent_hash: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Solution {
    time: u64,
    principal: Option<Principal>,
    bytes: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct SolutionAccepted {
    time: u64,
    cur_min_ones: u8,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum SolutionRejected {
    InvalidSolution,
    ChallengeMismatch,
    Other(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum SubmitSolutionResponse {
    Ok(SolutionAccepted),
    Err(SolutionRejected),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct GetBestSolutionResponse {
    time: u64,
    cur_min_ones: u8,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct GetAvailableTokenSupplyResponse {
    time: u64,
    total_amount: u8,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Offer {
    amount: u64,
    num_attached_cycles: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum SubmitOfferResponse {
    Accepted,
    Rejected(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct GetBestOfferResponse {
    amount: u64,
    num_cycles: u64,
    total_amount: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Proposal {
    id: u128,
    votes_for: u128,
    votes_against: u128,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
enum Result_1 {
    Ok(()),
    Err(String),
}

#[query]
fn icrc1_total_supply() -> u128 {
    TOKEN_TOTAL_SUPPLY
}

#[update]
fn icrc2_transfer(to: Principal, amount: u128) -> Result<u128, String> {
    let caller = ic_cdk::caller();
    BALANCES.with(|balances| {
        let mut balances = balances.borrow_mut();
        let from_balance = balances.get(&caller).cloned().unwrap_or(0);
        if from_balance < amount {
            return Err("Insufficient balance".to_string());
        }
        *balances.entry(caller).or_insert(0) -= amount;
        *balances.entry(to).or_insert(0) += amount;
        
        // Log the transaction
        let transaction = Transaction {
            timestamp: time(),
            from: caller,
            to,
            amount,
            fee: 0,
            memo: None,
        };
        TRANSACTIONS.with(|transactions| {
            transactions.borrow_mut().push(transaction);
        });
        
        Ok(amount)
    })
}

#[query]
fn icrc2_balance_of(account: Principal) -> u128 {
    BALANCES.with(|balances| {
        *balances.borrow().get(&account).unwrap_or(&0)
    })
}

#[query]
fn icrc2_name() -> String {
    TOKEN_NAME.to_string()
}

#[query]
fn icrc2_symbol() -> String {
    TOKEN_SYMBOL.to_string()
}

#[query]
fn icrc2_decimals() -> u8 {
    TOKEN_DECIMALS
}

#[update]
fn mint(to: Principal, amount: u128) -> Result<(), String> {
    BALANCES.with(|balances| {
        let mut balances = balances.borrow_mut();
        *balances.entry(to).or_insert(0) += amount;
        Ok(())
    })
}

#[query]
fn icrc3_get_transactions(start: usize, length: usize) -> Vec<Transaction> {
    TRANSACTIONS.with(|transactions| {
        let transactions = transactions.borrow();
        transactions.iter().skip(start).take(length).cloned().collect()
    })
}

#[query]
fn icrc3_get_transaction(index: usize) -> Option<Transaction> {
    TRANSACTIONS.with(|transactions| {
        transactions.borrow().get(index).cloned()
    })
}

#[query]
fn icrc3_get_account_transactions(account: Principal, start: usize, length: usize) -> Vec<Transaction> {
    TRANSACTIONS.with(|transactions| {
        let transactions = transactions.borrow();
        transactions
            .iter()
            .filter(|tx| tx.from == account || tx.to == account)
            .skip(start)
            .take(length)
            .cloned()
            .collect()
    })
}

#[query]
fn get_challenge() -> GetChallengeResponse {
    GetChallengeResponse {
        version: 1,
        min_num_ones: 5,
        time: time() as u64,
        randomness: 12345,
        parent_hash: vec![0, 1, 2, 3, 4, 5],
    }
}

#[update]
fn submit_solution(_solution: Solution) -> SubmitSolutionResponse {
    SubmitSolutionResponse::Ok(SolutionAccepted {
        time: time() as u64,
        cur_min_ones: 6,
    })
}

#[query]
fn get_best_solution() -> GetBestSolutionResponse {
    GetBestSolutionResponse {
        time: time() as u64,
        cur_min_ones: 6,
    }
}

#[query]
fn get_available_token_supply() -> GetAvailableTokenSupplyResponse {
    GetAvailableTokenSupplyResponse {
        time: time() as u64,
        total_amount: 100,
    }
}

#[update]
fn submit_offer(_offer: Offer) -> SubmitOfferResponse {
    SubmitOfferResponse::Accepted
}

#[query]
fn get_best_offer() -> GetBestOfferResponse {
    GetBestOfferResponse {
        amount: 1000,
        num_cycles: 5000,
        total_amount: 10000,
    }
}

fn simple_hash(data: &[u8]) -> u32 {
    data.iter().fold(0u32, |hash, &byte| hash ^ byte as u32)
}

#[update]
fn upload_wasm_module(gzipped_module: Vec<u8>) -> Result<String, String> {
    if gzipped_module.is_empty() {
        return Err("Invalid or empty module".to_string());
    }

    STORED_WASM_MODULE.with(|module| {
        *module.borrow_mut() = Some(gzipped_module.clone());
    });

    let hash = simple_hash(&gzipped_module);
    Ok(hash.to_string())
}

#[update]
fn update_maintainers(principals: Vec<Principal>) -> u128 {
    MAINTAINERS.with(|maintainers| {
        let mut maintainers = maintainers.borrow_mut();
        maintainers.clear();
        for principal in principals {
            maintainers.insert(principal);
        }
        maintainers.len() as u128
    })
}

#[update]
fn update_wasm(_wasm_module: String) -> u128 {
    // Default implementation: return a dummy value
    42
}

#[update]
fn vote_for_proposal(proposal_id: u128, vote: bool) -> Result_1 {
    PROPOSALS.with(|proposals| {
        let mut proposals = proposals.borrow_mut();
        let proposal = proposals.entry(proposal_id).or_insert(Proposal {
            id: proposal_id,
            votes_for: 0,
            votes_against: 0,
        });

        if vote {
            proposal.votes_for += 1;
        } else {
            proposal.votes_against += 1;
        }

        Result_1::Ok(())
    })
}

// Required by candid to generate did files
ic_cdk::export_candid!();
