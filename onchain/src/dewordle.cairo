#[starknet::contract]
mod DeWordle {
    use dewordle::interfaces::{IDeWordle, PlayerStat, DailyPlayerStat};

    use starknet::{ContractAddress};

    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map, Vec, MutableVecTrait,
    };
    use openzeppelin::access::accesscontrol::{AccessControlComponent};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    use dewordle::constants::LetterStates::{CORRECT, PRESENT, ABSENT};

    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");

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
        word_of_the_day: ByteArray, //TODO: hash word
        letters_in_word: Vec<felt252>, //TODO: hash letters
        word_len: u8,
        player_stat: Map<ContractAddress, PlayerStat>,
        daily_player_stat: Map<ContractAddress, DailyPlayerStat>, // TODO: track day
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
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(ADMIN_ROLE, owner);
    }

    #[abi(embed_v0)]
    impl DeWordleImpl of IDeWordle<ContractState> {
        fn set_daily_word(ref self: ContractState, word: ByteArray) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            let word_len = word.len();
            let mut i = 0;

            while (i < word_len) {
                self.letters_in_word.append().write(word[i].into());
                i += 1;
            };
            self.word_of_the_day.write(word);
            self.word_len.write(word_len.try_into().unwrap());
        }

        fn get_daily_word(self: @ContractState) -> ByteArray {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            self.word_of_the_day.read()
        }

        fn get_player_daily_stat(self: @ContractState, player: ContractAddress) -> DailyPlayerStat {
            let daily_stat = self.daily_player_stat.read(player);

            // A player without a stat will have 0 attempts remaining
            if daily_stat.attempt_remaining == 0 {
                DailyPlayerStat {
                    player: player, attempt_remaining: 6, has_won: false, won_at_attempt: 0,
                }
            } else {
                daily_stat
            }
        }

        fn play(ref self: ContractState) {
            let caller: ContractAddress = starknet::get_caller_address();

            let new_daily_stat = DailyPlayerStat {
                player: caller, attempt_remaining: 6, has_won: false, won_at_attempt: 0,
            };

            self.daily_player_stat.write(caller, new_daily_stat);
        }

        fn submit_guess(ref self: ContractState, guessed_word: ByteArray) -> Option<Span<u8>> {
            assert(guessed_word.len() == self.word_len.read().into(), 'Length does not match');
            let caller = starknet::get_caller_address();
            let daily_stat = self.daily_player_stat.read(caller);
            assert(!daily_stat.has_won, 'Player has already won');
            assert(daily_stat.attempt_remaining > 0, 'Player has exhausted attempts');
            if self.is_correct_word(guessed_word.clone()) {
                let new_daily_stat = DailyPlayerStat {
                    player: caller,
                    attempt_remaining: daily_stat.attempt_remaining - 1,
                    has_won: true,
                    won_at_attempt: 6 - daily_stat.attempt_remaining,
                };
                self.daily_player_stat.write(caller, new_daily_stat);
                Option::None
            } else {
                let new_daily_stat = DailyPlayerStat {
                    player: caller,
                    attempt_remaining: daily_stat.attempt_remaining - 1,
                    has_won: false,
                    won_at_attempt: 0,
                };
                self.daily_player_stat.write(caller, new_daily_stat);
                Option::Some(self.compare_word(guessed_word.clone()))
            }
        }


        fn is_correct_word(ref self: ContractState, guessed_word: ByteArray) -> bool {
            let correct_word: ByteArray = self.word_of_the_day.read();
            guessed_word == correct_word
        }

        fn compare_word(ref self: ContractState, guessed_word: ByteArray) -> Span<u8> {
            let guessed_word_len = guessed_word.len();
            let word = self.get_daily_word();

            assert(guessed_word_len == word.len(), 'Length does not match');

            //  Initialize tracking arrays
            let mut i = 0;
            let mut word_states = array![]; // Final letter states
            let mut temp_states = array![]; // Temporary states to track exact matches
            let mut letter_count_list = array![]; // To track letter frequency in the target word

            //  Count occurrences of each letter in the daily word
            while (i < guessed_word_len) {
                let mut count: u32 = 0;
                let mut j = 0;
                while (j < guessed_word_len) {
                    if (word[i] == word[j]) {
                        count += 1; // Count occurrences of the letter
                    }
                    j += 1;
                };
                letter_count_list.append(count);
                i += 1;
            };

            i = 0;

            //  Identify exact matches and mark temporary state
            while (i < guessed_word_len) {
                if (guessed_word[i] == word[i]) {
                    temp_states.append(CORRECT); // Letter is in the correct position
                } else {
                    temp_states.append(ABSENT); // Default to ABSENT for now
                }
                i += 1;
            };

            i = 0;

            //  Identify misplaced letters
            while (i < guessed_word_len) {
                let prev_word_states = word_states.clone();
                // If the letter was marked ABSENT in the temporary states, check for misplaced
                // occurrences
                if (*temp_states.at(i) == ABSENT) {
                    let mut j = 0;
                    while (j < guessed_word_len) {
                        if (guessed_word[i] == word[j]) {
                            if (*temp_states.at(j) != CORRECT) {
                                word_states.append(PRESENT); // Mark as PRESENT (misplaced)
                                break;
                            }
                        }
                        j += 1;
                    };

                    // If no match was found, mark as ABSENT
                    if (prev_word_states.len() == word_states.len()) {
                        word_states.append(ABSENT);
                    }
                } else {
                    // If the letter was previously marked as CORRECT, preserve the state
                    word_states.append(CORRECT);
                }

                i += 1;
            };

            // Return the final array of letter states
            word_states.span()
        }
    }
}
