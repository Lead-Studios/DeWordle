use dewordle::constants::{LetterState, LetterStateIntoU8, U8TryIntoLetterState};

#[test]
fn test_convert_letterstate_into_u8() {
    assert(LetterState::CORRECT.into() == 0_u8, 'CORRECT must return 0_u8');
    assert(LetterState::PRESENT.into() == 1_u8, 'PRESENT must return 1_u8');
    assert(LetterState::ABSENT.into() == 2_u8, 'ABSENT must return 2_u8');
}

#[test]
fn test_convert_u8_into_letterstate() {
    let state = 0_u8.try_into().unwrap();
    assert(state == LetterState::CORRECT, '0_u8 must return CORRECT');

    let state = 1_u8.try_into().unwrap();
    assert(state == LetterState::PRESENT, '1_u8 must return PRESENT');

    let state = 2_u8.try_into().unwrap();
    assert(state == LetterState::ABSENT, '2_u8 must return ABSENT');

    let wrong_state: Option<LetterState> = 3_u8.try_into();
    assert(wrong_state.is_none(), 'others must return Option::None');
}
