//! YourContract - A simple Soroban contract demonstrating state modifications
//! Implements basic contract functions such as initialization, data storage, and retrieval

#![no_std] // Prevents the standard library from being linked, reducing contract size.
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Vec};

#[contract]
pub struct YourContract; // Defines the contract structure

#[contractimpl]
impl YourContract {
    /// Initializes the contract by setting the owner address.
    /// This function should be called once when deploying the contract.
    ///
    /// # Arguments
    /// * `env` - The execution environment provided by Soroban.
    /// * `owner` - The address of the owner who deploys the contract.
    pub fn initialize(env: Env, owner: Address) {
        let key = Symbol::new(&env, "owner"); // Defines the key for storing the owner's address
        env.storage().persistent().set(&key, &owner); // Stores the owner's address persistently
    }

    /// Retrieves the stored owner of the contract.
    ///
    /// # Arguments
    /// * `env` - The execution environment.
    ///
    /// # Returns
    /// * The stored owner address.
    pub fn get_owner(env: Env) -> Address {
        let key = Symbol::new(&env, "owner"); // Defines the key for fetching the owner
        env.storage().persistent().get(&key).unwrap() // Retrieves the stored owner address
    }

    /// Stores a key-value pair in contract storage.
    /// This function allows dynamic data storage in the contract.
    ///
    /// # Arguments
    /// * `env` - The execution environment.
    /// * `key` - A unique identifier for the stored value.
    /// * `value` - The data to be stored.
    pub fn set_data(env: Env, key: Symbol, value: Symbol) {
        let storage = env.storage().persistent(); // Access persistent storage
        storage.set(&key, &value); // Stores the key-value pair
    }

    /// Retrieves a stored value by its key.
    ///
    /// # Arguments
    /// * `env` - The execution environment.
    /// * `key` - The key associated with the stored value.
    ///
    /// # Returns
    /// * The stored value if it exists, otherwise `None`.
    pub fn get_data(env: Env, key: Symbol) -> Option<Symbol> {
        let storage = env.storage().persistent(); // Access persistent storage
        storage.get(&key) // Retrieves the value associated with the key
    }

    /// Appends an entry to a list stored under the specified key.
    /// If no list exists, it creates a new list.
    ///
    /// # Arguments
    /// * `env` - The execution environment.
    /// * `key` - A unique identifier for the list.
    /// * `value` - The value to be appended.
    pub fn add_entry(env: Env, key: Symbol, value: Symbol) {
        let storage = env.storage().persistent(); // Access persistent storage
        let mut list: Vec<Symbol> = storage.get(&key).unwrap_or(Vec::new(&env)); // Retrieves or initializes a list
        list.push_back(value); // Appends the new value to the list
        storage.set(&key, &list); // Updates the stored list
    }

    /// Retrieves all entries stored under the specified key.
    ///
    /// # Arguments
    /// * `env` - The execution environment.
    /// * `key` - The key associated with the list of values.
    ///
    /// # Returns
    /// * A vector containing all stored entries.
    pub fn get_entries(env: Env, key: Symbol) -> Vec<Symbol> {
        let storage = env.storage().persistent(); // Access persistent storage
        storage.get(&key).unwrap_or(Vec::new(&env)) // Retrieves the stored list or returns an empty vector
    }
}

mod test; // Module for unit testing
