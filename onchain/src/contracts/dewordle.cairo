#[starknet::contract]
pub mod DeWordle {
    use dewordle::constants::LetterState;
    use dewordle::interfaces::{DailyPlayerStat, IDeWordle, PlayerStat};

    use dewordle::utils::{
        compare_word, get_next_midnight_timestamp, hash_letter, hash_word, is_correct_hashed_word,
    };
    use openzeppelin::access::accesscontrol::{AccessControlComponent};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    use starknet::storage::{
        Map, MutableVecTrait, StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait,
    };

    use starknet::{ContractAddress, get_block_timestamp};

    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");
    const SECONDS_IN_A_DAY: u64 = 86400;

    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;

    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;


    #[storage]
    struct Storage {
        word_of_the_day: felt252,
        letters_in_word: Vec<felt252>,
        word_len: u8,
        player_stat: Map<ContractAddress, PlayerStat>,
        daily_player_stat: Map<ContractAddress, DailyPlayerStat>,
        end_of_day_timestamp: u64,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        DayUpdated: DayUpdated,
        PlayerStatsReset: PlayerStatsReset,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(ADMIN_ROLE, owner);
        let midnight_timestamp = get_next_midnight_timestamp();
        self.end_of_day_timestamp.write(midnight_timestamp);
    }

    #[derive(Drop, starknet::Event)]
    struct DayUpdated {
        new_end_of_day: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerStatsReset {
        player: ContractAddress,
        timestamp: u64,
    }

    #[abi(embed_v0)]
    impl DeWordleImpl of IDeWordle<ContractState> {
        /// @notice Sets the word of the day
        /// @param word: The ByteArray representing the new word to be set
        /// @dev Only callable by an address with ADMIN_ROLE
        /// @dev Hashes the word and stores it, along with each individual letter
        fn set_daily_word(ref self: ContractState, word: ByteArray) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            let word_len = word.len();
            let hash_word = hash_word(word.clone());
            self.word_of_the_day.write(hash_word);
            let mut i = 0;

            while (i < word_len) {
                let hashed_letter = hash_letter(word[i].into());
                self.letters_in_word.append().write(hashed_letter);
                i += 1;
            };

            self.word_len.write(word_len.try_into().unwrap());
        }

        /// @notice Retrieves a player's daily statistics
        /// @param player: The address of the player
        /// @return DailyPlayerStat: The daily stats for the given player
        /// @dev Returns default values if player hasn't played today (6 attempts, not won)
        fn get_player_daily_stat(self: @ContractState, player: ContractAddress) -> DailyPlayerStat {
            let daily_stat = self.daily_player_stat.read(player);

            // A player without a stat will have 0 attempts remaining
            if daily_stat.attempt_remaining == 0 {
                DailyPlayerStat {
                    player: player,
                    attempt_remaining: 6,
                    has_won: false,
                    won_at_attempt: 0,
                    last_attempt_timestamp: 0,
                }
            } else {
                daily_stat
            }
        }

        // TODO: remove this
        fn play(ref self: ContractState) {
            let caller: ContractAddress = starknet::get_caller_address();
            let current_timestamp = get_block_timestamp();

            let new_daily_stat = DailyPlayerStat {
                player: caller,
                attempt_remaining: 6,
                has_won: false,
                won_at_attempt: 0,
                last_attempt_timestamp: current_timestamp,
            };

            self.daily_player_stat.write(caller, new_daily_stat);
        }

        /// @notice Submit a guess for the daily word
        /// @param guessed_word: The ByteArray representing the player's guess
        /// @return Option<Span<LetterState>>: None if the guess is correct, otherwise returns a
        /// Span of LetterState indicating the correctness of each letter @dev Verifies the guess
        /// length, validates player has attempts remaining and hasn't already won @dev Updates
        /// player stats based on the outcome of the guess
        fn submit_guess(
            ref self: ContractState, guessed_word: ByteArray,
        ) -> Option<Span<LetterState>> {
            assert(guessed_word.len() == self.word_len.read().into(), 'Length does not match');
            let caller = starknet::get_caller_address();
            let current_timestamp = get_block_timestamp();

            if current_timestamp >= self.end_of_day_timestamp.read() {
                let new_end_of_day = get_next_midnight_timestamp();
                self.end_of_day_timestamp.write(new_end_of_day);
                self.emit(DayUpdated { new_end_of_day });

                let new_daily_stat = DailyPlayerStat {
                    player: caller,
                    attempt_remaining: 6,
                    has_won: false,
                    won_at_attempt: 0,
                    last_attempt_timestamp: current_timestamp,
                };
                self.daily_player_stat.write(caller, new_daily_stat);
            }
            let mut daily_stat = self.daily_player_stat.read(caller);
            assert(!daily_stat.has_won, 'Player has already won');
            assert(daily_stat.attempt_remaining > 0, 'Player has exhausted attempts');

            let hash_guessed_word = hash_word(guessed_word.clone());
            if is_correct_hashed_word(self._get_daily_word(), hash_guessed_word) {
                let new_daily_stat = DailyPlayerStat {
                    player: caller,
                    attempt_remaining: daily_stat.attempt_remaining - 1,
                    has_won: true,
                    won_at_attempt: 7 - (daily_stat.attempt_remaining - 1),
                    last_attempt_timestamp: current_timestamp,
                };
                self.daily_player_stat.write(caller, new_daily_stat);
                Option::None
            } else {
                let new_daily_stat = DailyPlayerStat {
                    player: caller,
                    attempt_remaining: daily_stat.attempt_remaining - 1,
                    has_won: false,
                    won_at_attempt: 0,
                    last_attempt_timestamp: current_timestamp,
                };
                self.daily_player_stat.write(caller, new_daily_stat);
                Option::Some(compare_word(self._get_daily_letters(), guessed_word.clone()))
            }
        }


        // TODO refac: move to internal
        // update tests accordingly

        /// @notice Updates the end of day timestamp if the current day has ended
        /// @dev Checks if current block timestamp is past the end of day and updates to next
        /// midnight if needed @dev Emits a DayUpdated event when the timestamp is updated
        fn update_end_of_day(ref self: ContractState) {
            if get_block_timestamp() >= self.end_of_day_timestamp.read() {
                let new_end_of_day = get_next_midnight_timestamp();
                self.end_of_day_timestamp.write(new_end_of_day);
                self.emit(DayUpdated { new_end_of_day });
            }
        }

        /// @notice Gets the timestamp for when the current day ends
        /// @return u64 The Unix timestamp for the end of the current day
        fn get_end_of_day_timestamp(self: @ContractState) -> u64 {
            self.end_of_day_timestamp.read()
        }
    }

    #[generate_trait]
    pub impl InternalFunctions of InternalFunctionsTrait {
        /// @notice Retrieves the hashed word of the day
        /// @return felt252 The hashed word of the day
        fn _get_daily_word(self: @ContractState) -> felt252 {
            self.word_of_the_day.read()
        }

        /// @notice Gets the array of hashed letters for the daily word
        /// @return Array<felt252> An array containing each hashed letter of the daily word
        fn _get_daily_letters(self: @ContractState) -> Array<felt252> {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            let mut letter_arr = array![];
            for i in 0
                ..self
                    .letters_in_word
                    .len() {
                        letter_arr.append(self.letters_in_word.at(i).read());
                    };
            letter_arr
        }
    }
}
