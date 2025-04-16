import React, { useEffect, useState } from "react";
import Web3 from "web3";
import PaymentGateway from "../abis/PaymentGateway.json";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const Payment = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [ethPrice, setEthPrice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  useEffect(() => {
    const init = async () => {
      try {
        const loginMode = localStorage.getItem("loginMode");
        const provider =
          loginMode === "ganache"
            ? new Web3("http://127.0.0.1:7545")
            : new Web3(window.ethereum);

        setWeb3(provider);

        const accounts = await provider.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await provider.eth.net.getId();
        const deployedNetwork = PaymentGateway.networks[networkId.toString()];

        if (!deployedNetwork) {
          setError("Smart contract not deployed on this network.");
          return;
        }

        const contractInstance = new provider.eth.Contract(
          PaymentGateway.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);

        const res = await axios.get("https://api.coinbase.com/v2/exchange-rates?currency=ETH");
        setEthPrice(parseFloat(res.data.data.rates.USD));
      } catch (err) {
        console.error(err);
        setError("Failed to initialize blockchain.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const isGanacheAccount = async (addr) => {
    try {
      const ganache = new Web3("http://127.0.0.1:7545");
      const ganacheAccounts = await ganache.eth.getAccounts();
      return ganacheAccounts.includes(addr);
    } catch {
      return false;
    }
  };

  const handlePay = async () => {
    setError("");
    setPaying(true);

    try {
      const ethAmount = (product.priceUSD / ethPrice).toFixed(6);
      const weiAmount = web3.utils.toWei(ethAmount, "ether");
      const timestamp = Math.floor(Date.now() / 1000);

      const loginMode = localStorage.getItem("loginMode");
      const isUsingMetaMask = loginMode === "metamask";
      const recipientIsGanache = await isGanacheAccount(recipient);

      if (isUsingMetaMask && recipientIsGanache) {
        setError("❌ Cannot send from MetaMask (Sepolia) to Ganache address.");
        setPaying(false);
        return;
      }

      if (!isUsingMetaMask && !recipientIsGanache) {
        setError("❌ Cannot send from Ganache to MetaMask address.");
        setPaying(false);
        return;
      }

      const hash = web3.utils.soliditySha3(
        { type: "address", value: account },
        { type: "address", value: recipient },
        { type: "uint256", value: weiAmount },
        { type: "string", value: product.id },
        { type: "uint256", value: timestamp }
      );

      const receipt = await contract.methods
        .payWithVerification(recipient, product.id, timestamp, hash)
        .send({ from: account, value: weiAmount });

      const txLog = {
        from: account,
        to: recipient,
        product: product.name,
        usd: product.priceUSD,
        eth: ethAmount,
        txHash: receipt.transactionHash,
        timestamp: new Date().toLocaleString(),
        hash,
        network: isUsingMetaMask ? "MetaMask (Sepolia)" : "Ganache"
      };

      const history = JSON.parse(localStorage.getItem("txHistory")) || [];
      history.push(txLog);
      localStorage.setItem("txHistory", JSON.stringify(history));

      navigate("/success");
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed: " + err.message);
    }

    setPaying(false);
  };

  const ethAmount = ethPrice ? (product.priceUSD / ethPrice).toFixed(6) : "Loading...";

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h2 className="mb-3">Confirm Payment</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Spinner animation="border" />}

        {!loading && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control value={product?.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>USD Price</Form.Label>
              <Form.Control value={`$${product?.priceUSD}`} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ETH Equivalent</Form.Label>
              <Form.Control value={`${ethAmount} ETH`} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Recipient Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter valid address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handlePay} disabled={paying}>
              {paying ? "Processing..." : "Pay Now (Secure)"}
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default Payment;
