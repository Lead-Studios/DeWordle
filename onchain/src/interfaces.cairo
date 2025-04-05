use dewordle::constants::LetterState;
use starknet::ContractAddress;

#[starknet::interface]
pub trait IDeWordle<TContractState> {
    fn set_daily_word(ref self: TContractState, word: ByteArray);

    fn get_player_daily_stat(self: @TContractState, player: ContractAddress) -> DailyPlayerStat;
    fn play(ref self: TContractState);

    fn submit_guess(ref self: TContractState, guessed_word: ByteArray) -> Option<Span<LetterState>>;
    fn update_end_of_day(ref self: TContractState);
    fn get_end_of_day_timestamp(self: @TContractState) -> u64;
    fn get_player_streaks(self: @TContractState, player: ContractAddress) -> (u32, u32);
}

#[derive(Drop, Serde, starknet::Store)]
pub struct PlayerStat {
    pub player: ContractAddress,
    pub score: u64, //TODO: Impl scoring logic
    pub games_played: u64,
    pub games_won: u64,
    pub current_streak: u64,
    pub max_streak: u64 //TODO: Impl streaking logic
}

#[derive(Drop, Serde, starknet::Store, Debug)]
pub struct DailyPlayerStat {
    pub player: ContractAddress,
    pub attempt_remaining: u8,
    pub has_won: bool,
    pub won_at_attempt: u8,
    pub last_attempt_timestamp: u64,
}
