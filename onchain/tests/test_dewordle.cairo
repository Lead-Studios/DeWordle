use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use dewordle::interfaces::{IDeWordleDispatcher, IDeWordleDispatcherTrait};

fn deploy_contract() -> ContractAddress {
    let contract = declare("DeWordle").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}
// #[test]
// fn test_() {
// }


