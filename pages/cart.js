import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { Socket, io } from "socket.io-client";

export default function Cart() {
    const socket = io("https://estore-team-terka.webpubsub.azure.com", {

        path: "/clients/socketio/hubs/Hub",
    });

    console.log("rerender")
    
    socket.on("connected", (socketId) => {
        //Pass this ID to service bus
        console.log(socket.id);
        console.log(socketId);
    });
    
    socket.on("message", (arg) => {
        console.log(arg);
    });

    const items = [
      { id: 1, name: 'Product 1', price: 10, count: 12 },
      { id: 2, name: 'Product 2', price: 20, count: 5 },
    ];

    const calculatePrice = () => {
        let totalPrice = 0;
        items.forEach((item) => {
            totalPrice += item.price * item.count;
        });
        return totalPrice;
    };

    const [customerData, setCustomerData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        country: '',
        phone: '',
        mail: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    let savedSocketID = null;

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://estore-team-terka-dpr.mangobeach-2474d9e9.northeurope.azurecontainerapps.io/api/submit-order', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                socket_id: socket.id, 
                customer: customerData, 
                order: { 
                    items: items, 
                    total_price: calculatePrice() 
                } 
            }),
          })
        
        // Logic to handle form submission
        savedSocketID = socket.id;
        console.log('Customer data:', customerData);
        console.log('Buy button clicked with price: ', calculatePrice());
        console.log('Saved socket ID: ', savedSocketID);
        console.log(JSON.stringify({ 
            socketId: socket.id, 
            customer: customerData, 
            order: { 
                items: items, 
                totalPrice: calculatePrice() 
            } 
        }))
    };

    return (
      <div className={styles.container}>
        <Head>
          <title>Shopping Cart</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className={styles.title}>Shopping Cart</h1>

          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.id} className={styles.shoppingCartItem}>
                <Image
                    priority
                    src="/images/product1.png"
                    height={144}
                    width={144}
                    alt={item.name}
                />
                <p className={styles.name}> 
                    {item.name} <br />
                    ${item.price} <br />
                    {item.count} pcs 
                </p>
              </li>
            ))}
          </ul>

            <form className={styles.items} onSubmit={handleSubmit}>
                <label className={styles.formLabel}>
                    First Name:
                    <input
                        type="text"
                        name="first_name"
                        value={customerData.first_name}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.formLabel}>
                    Last Name:
                    <input
                        type="text"
                        name="last_name"
                        value={customerData.last_name}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.formLabel}>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={customerData.address}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.formLabel}>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={customerData.country}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.formLabel}>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={customerData.phone}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.formLabel}>
                    Email:
                    <input
                        type="email"
                        name="mail"
                        value={customerData.mail}
                        onChange={handleInputChange}
                    />
                </label>

                <h4 className={styles.finalPrice}>Final Price: ${calculatePrice()}</h4>

                <button type="submit" className={styles.flexButton}>
                    Buy
                </button>
            </form>
        </main>
      </div>
    );
  }