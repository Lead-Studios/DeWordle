use starknet::ContractAddress;

#[starknet::interface]
pub trait IDeWordle<TContractState> {
    fn set_daily_word(ref self: TContractState, word: ByteArray);
    fn get_daily_word(self: @TContractState) -> ByteArray;

    fn play(ref self: TContractState);
    // fn get_player_daily_stat(self: @TContractState, player: ContractAddress) -> DailyPlayerStat;

    fn submit_guess(ref self: TContractState, guessed_word: ByteArray);
    fn is_correct_word(ref self: TContractState, guessed_word: ByteArray) -> bool;
    fn compare_word(ref self: TContractState, guessed_word: ByteArray) -> Span<u8>;
}


#[derive(Drop, Serde, starknet::Store)]
pub struct PlayerStat {
    pub player: ContractAddress,
    pub score: u64,
    pub games_played: u64,
    pub games_won: u64,
    pub current_streak: u64,
    pub max_streak: u64
}

#[derive(Drop, Serde, starknet::Store)]
pub struct DailyPlayerStat {
    pub player: ContractAddress,
    pub attempt_remaining: u8,
    pub has_won: bool,
    pub won_at_attempt: u8,
}
