#[starknet::contract]
mod DeWordle {
    use dewordle::interfaces::{IDeWordle, PlayerStat, DailyPlayerStat};

    use starknet::{ContractAddress};

    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map, Vec,
        MutableVecTrait, VecTrait
    };

    #[storage]
    struct Storage {
        word_of_the_day: ByteArray, //TODO: hash word
        letters_in_word: Vec<felt252>, //TODO: hash letters
        word_len: u8,
        player_stat: Map<ContractAddress, PlayerStat>,
        daily_player_stat: Map<ContractAddress, DailyPlayerStat>, // TODO: track day
    }

    #[abi(embed_v0)]
    impl DeWordleImpl of IDeWordle<ContractState> {
        // TODO
        fn set_daily_word(ref self: ContractState, word: ByteArray) {}

        //TODO
        fn get_daily_word(self: @ContractState) -> ByteArray {
            let word: ByteArray = "word";
            word
        }

        //TODO
        // fn get_player_daily_stat(self: @ContractState, player: ContractAddress) ->
        // DailyPlayerStat {}

        // TODO
        fn play(ref self: ContractState) {}

        // TODO
        fn submit_guess(ref self: ContractState, guessed_word: ByteArray) {}

        // TODO
        fn is_correct_word(ref self: ContractState, guessed_word: ByteArray) -> bool {
            true
        }

        // TODO
        fn compare_word(ref self: ContractState, guessed_word: ByteArray) -> Span<u8> {
            array![0, 1, 2].span()
        }
    }
}
