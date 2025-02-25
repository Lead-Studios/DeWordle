#[derive(PartialEq, Copy, Drop, Serde)]
pub enum LetterState {
    CORRECT,
    PRESENT,
    ABSENT
}

pub impl LetterStateIntoU8 of Into<LetterState, u8> {
    fn into(self: LetterState) -> u8 {
        match self {
            LetterState::CORRECT => 0,
            LetterState::PRESENT => 1,
            LetterState::ABSENT => 2
        }
    }
}

pub impl U8TryIntoLetterState of TryInto<u8, LetterState> {
    fn try_into(self: u8) -> Option<LetterState> {
        match self {
            0 => Option::Some(LetterState::CORRECT),
            1 => Option::Some(LetterState::PRESENT),
            2 => Option::Some(LetterState::ABSENT),
            _ => Option::None
        }
    }
}
