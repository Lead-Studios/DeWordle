#[starknet::contract]
pub mod DeWordle {
    use dewordle::constants::LetterState;
    use dewordle::interfaces::{IDeWordle, PlayerStat, DailyPlayerStat};

    use dewordle::utils::{compare_word, is_correct_word};
    use openzeppelin::access::accesscontrol::{AccessControlComponent};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map, Vec, MutableVecTrait,
    };

    use starknet::{ContractAddress};

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

        fn submit_guess(
            ref self: ContractState, guessed_word: ByteArray
        ) -> Option<Span<LetterState>> {
            assert(guessed_word.len() == self.word_len.read().into(), 'Length does not match');
            let caller = starknet::get_caller_address();
            let daily_stat = self.daily_player_stat.read(caller);
            assert(!daily_stat.has_won, 'Player has already won');
            assert(daily_stat.attempt_remaining > 0, 'Player has exhausted attempts');
            if is_correct_word(self.get_daily_word(), guessed_word.clone()) {
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
                Option::Some(compare_word(self.get_daily_word(), guessed_word.clone()))
            }
        }
    }

    #[generate_trait]
    pub impl InternalFunctions of InternalFunctionsTrait {}
}
