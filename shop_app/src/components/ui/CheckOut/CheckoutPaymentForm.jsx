import React, { useState } from 'react';

const CheckoutPaymentForm = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        securityCode: "",
    });

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];


    return (
        <div>
            <div className="d-flex gap-3">
                <button
                    className={`btn btn-outline-primary ${selectedPayment === "card" ? "active" : ""}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setSelectedPayment("card")
                    }}
                    disabled={selectedPayment && selectedPayment !== "card"}
                >
                    Visa / MasterCard
                </button>

                <button
                    className={`btn btn-outline-success ${selectedPayment === "paypal" ? "active" : ""}`}
                    onClick={() => setSelectedPayment("paypal")}
                    disabled={selectedPayment && selectedPayment !== "paypal"}
                >
                    PayPal
                </button>
            </div>
            {selectedPayment === "card" && (
            <div className="mt-4 bg-light text-dark p-3 rounded">
                <h5>Enter Card Details</h5>
                <input
                    type="text"
                    placeholder="Card Number"
                    className="form-control mb-2"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                        e.preventDefault();
                        setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value
                        });
                    }}
                />

                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={cardDetails.expiryMonth}
                        onChange={(e) => setCardDetails({
                            ...cardDetails,
                            expiryMonth: e.target.value
                        })}
                    >
                        <option value="" disabled>Month</option>
                        {months.map((month) => (
                            <option key={month.value}
                            >{month.label}</option>
                        ))}
                    </select>

                            <select
                            className="form-select"
                            value={cardDetails.expiryYear}
                        onChange={(e) => setCardDetails({
                            ...cardDetails,
                            expiryYear: e.target.value
                        })}
                    >
                        <option value="" disabled>Year</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={2025 + i}>
                                {2025 + i}
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Security Code (CVV)"
                    className="form-control mt-2"
                    value={cardDetails.securityCode}
                    onChange={(e) => setCardDetails({
                        ...cardDetails,
                        securityCode: e.target.value
                    })}
                />
            </div>
            )}
        </div>
    )
}

export default CheckoutPaymentForm;