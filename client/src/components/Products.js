import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: "prod1",
    name: "Wireless Headphones",
    priceUSD: 1.99,
    image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
    description: "Experience true wireless freedom with noise-cancelling sound.",
    rating: 4.5,
    category: "Electronics"
  },
  {
    id: "prod2",
    name: "Smart Watch",
    priceUSD: 149.99,
    image: "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg",
    description: "Track your fitness with a sleek and powerful smartwatch.",
    rating: 4.0,
    category: "Wearables"
  },
  {
    id: "prod3",
    name: "Bluetooth TWS",
    priceUSD: 129.99,
    image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    description: "Compact and crystal-clear audio for any occasion.",
    rating: 3.8,
    category: "Audio"
  },
  {
    id: "prod4",
    name: "4K UHD Smart TV",
    priceUSD: 799.99,
    image: "https://images.pexels.com/photos/28549934/pexels-photo-28549934/free-photo-of-modern-home-living-room-with-smart-devices.jpeg",
    description: "Stunning 4K resolution with dynamic smart features.",
    rating: 4.7,
    category: "Entertainment"
  }
];

const Products = () => {
  const [ethPrice, setEthPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://api.coinbase.com/v2/exchange-rates?currency=ETH")
      .then((res) => {
        setEthPrice(parseFloat(res.data.data.rates.USD));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🛍️ Our Premium Products</h2>
      <p className="text-center text-muted mb-5">
        Explore top-quality tech gadgets priced in both USD and ETH!
      </p>

      <div className="row">
        {products.map((product) => {
          const ethEquivalent = ethPrice
            ? (product.priceUSD / ethPrice).toFixed(6)
            : "Loading...";

          return (
            <div className="col-md-6 col-lg-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <p className="mb-1">
                    <strong>USD:</strong> ${product.priceUSD.toFixed(2)}
                  </p>
                  <p className="mb-1">
                    <strong>ETH:</strong> {ethEquivalent} ETH
                  </p>
                  <p className="text-muted">
                    <small>Category: {product.category}</small>
                  </p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => {
                      localStorage.setItem(
                        "selectedProduct",
                        JSON.stringify(product)
                      );
                      navigate("/payment");
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
