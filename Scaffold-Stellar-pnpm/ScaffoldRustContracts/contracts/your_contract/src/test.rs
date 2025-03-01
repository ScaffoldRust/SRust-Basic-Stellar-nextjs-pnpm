#![cfg(test)]
use crate::{YourContract, YourContractClient};
use soroban_sdk::testutils::Address as AddressTest;
use soroban_sdk::{Env, Symbol, Vec, Address};

#[test]
fn test_initialize() {
    // Create a new test environment
    let env = Env::default();
    
    // Register the contract and get its ID
    let contract_id = env.register(YourContract, ());
    
    // Create a client to interact with the contract
    let client = YourContractClient::new(&env, &contract_id);
    
    // Generate an address to act as the contract owner
    let owner = Address::generate(&env);
    
    // Initialize the contract with the generated owner
    client.initialize(&owner);
    
    // Retrieve the stored owner and verify it matches the expected value
    let stored_owner = client.get_owner();
    assert_eq!(stored_owner, owner);
}

#[test]
fn test_set_and_get_data() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);

    // Define key-value pair for testing
    let key = Symbol::new(&env, "test_key");
    let value = Symbol::new(&env, "test_value");

    // Set data in the contract
    client.set_data(&key, &value);

    // Retrieve the stored data and verify correctness
    let retrieved_value = client.get_data(&key);
    assert_eq!(retrieved_value, Some(value));
}

#[test]
fn test_add_and_get_entries() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);

    // Define a list key and multiple values
    let key = Symbol::new(&env, "list_key");
    let value1 = Symbol::new(&env, "value1");
    let value2 = Symbol::new(&env, "value2");

    // Add multiple values to the list
    client.add_entry(&key, &value1);
    client.add_entry(&key, &value2);

    // Retrieve stored entries and compare with expected values
    let entries = client.get_entries(&key);
    let expected = Vec::from_array(&env, [value1, value2]);
    assert_eq!(entries, expected);
}

#[test]
fn test_get_nonexistent_data() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);
    
    // Define a key that has not been set
    let nonexistent_key = Symbol::new(&env, "does_not_exist");
    let result = client.get_data(&nonexistent_key);
    
    // Verify that retrieving an unset key returns None
    assert_eq!(result, None);
}

#[test]
fn test_get_nonexistent_entries() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);
    
    // Define a list key that has no entries
    let nonexistent_key = Symbol::new(&env, "nonexistent_list");
    let entries = client.get_entries(&nonexistent_key);
    
    // Verify that retrieving entries from an empty list returns an empty vector
    assert_eq!(entries.len(), 0);
}

#[test]
fn test_update_existing_data() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);
    
    // Define a key and its values
    let key = Symbol::new(&env, "update_key");
    let initial_value = Symbol::new(&env, "initial_value");
    let updated_value = Symbol::new(&env, "updated_value");
    
    // Set initial data value
    client.set_data(&key, &initial_value);
    let result = client.get_data(&key);
    assert_eq!(result, Some(initial_value));
    
    // Update the stored data
    client.set_data(&key, &updated_value);
    let updated_result = client.get_data(&key);
    
    // Verify that the value was successfully updated
    assert_eq!(updated_result, Some(updated_value));
}

#[test]
fn test_owner_initialization() {
    let env = Env::default();
    let contract_id = env.register(YourContract, ());
    let client = YourContractClient::new(&env, &contract_id);
    
    // Generate two different addresses
    let owner1 = Address::generate(&env);
    let owner2 = Address::generate(&env);
    
    // Initialize the contract with the first owner
    client.initialize(&owner1);
    let stored_owner = client.get_owner();
    assert_eq!(stored_owner, owner1);
    
    // Re-initialize the contract with a different owner
    client.initialize(&owner2);
    let new_stored_owner = client.get_owner();
    
    // Verify that the owner has been updated
    assert_eq!(new_stored_owner, owner2);
}
