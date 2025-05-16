pub fn count_ones(number: u8) -> u8 {
    // Convert the number to its text representation
    let text = format!("{:b}", number);
    // Iterate through each character in the string and count how many '1's there are
    text.chars().filter(|&c| c == '1').count() as u8
}
