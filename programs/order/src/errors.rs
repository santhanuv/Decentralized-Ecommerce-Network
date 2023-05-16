use anchor_lang::error_code;

#[error_code]
pub enum OrderError {
    #[msg("Quantity required is not avaiable in inventory")]
    QuantityNotAvailable,
    #[msg("Order already accepted")]
    OrderReAcceptError,
    #[msg("Signer is not authorized to cancel the order.")]
    SignerNotAuth,
    #[msg("Invalid Seller for accepting the cancel order request.")]
    InvalidSellerSigner,
    #[msg("Invalid Buyer for accepting the cancel order request.")]
    InvalidBuyerSigner,
    #[msg("Order not canceled.")]
    OrderNotCanceled,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Order already requested for cancellation.")]
    ReCancelRequestError,
    #[msg("Unable to transfer sol from order account")]
    RefundError,
    #[msg("Order already completed but is corrupted.")]
    CompletedOrderCancelError,
    #[msg("Order already accepted by seller. Please send cancel request")]
    CloseAcceptedOrderError,
    #[msg("Cannot complete unconfirmed orders.")]
    OrderNotConfirmedError,
    #[msg("Order already confirmed.")]
    ReConfirmError,
}
