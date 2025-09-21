import React, { useState } from 'react';

const CheckoutForm = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');


    return (
        <div>
            <div className="form-row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john.doe@example.com"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        className="form-control"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="">Select a country</option>
                        <option value="USA">United States of America</option>
                        <option value="CAN">Canada</option>
                    </select>
                </div>
                <div className="form-row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="street">Street Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                            placeholder="123 Main St"
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            placeholder="Anytown"
                        />
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="state">State / County</label>
                    <input
                        type="text"
                        className="form-control"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        placeholder="State"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-4 mb-3">
                    <label htmlFor="zip">ZIP / Postal Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        required
                        placeholder="12345"
                    />
                </div>
            </div>
        </div>
    )
}

export default CheckoutForm;