#[starknet::contract]
mod DeWordle {
    use dewordle::interfaces::{IDeWordle};

    #[storage]
    struct Storage {}

    #[abi(embed_v0)]
    impl DeWordleImpl of IDeWordle<ContractState> {}
}
