use anchor_lang::error_code;

#[error_code]
pub enum OrderError {
    #[msg("Quantity required is not avaiable in inventory")]
    QuantityNotAvailable,
    #[msg("Order already accepted")]
    OrderReAcceptError,
}
