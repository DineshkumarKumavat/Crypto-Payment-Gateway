import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState("");
  const [lastTx, setLastTx] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const web3 = new Web3("http://127.0.0.1:7545");
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const balanceWei = await web3.eth.getBalance(accounts[0]);
      setBalance(web3.utils.fromWei(balanceWei, "ether"));

      const history = JSON.parse(localStorage.getItem("txHistory") || "[]");
      setLastTx(history[history.length - 1]);
    };

    load();
  }, []);

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h2 className="text-success">✅ Payment Successful!</h2>
        {lastTx && (
          <>
            <p><strong>Product:</strong> {lastTx.product}</p>
            <p><strong>To:</strong> {lastTx.to}</p>
            <p><strong>Amount:</strong> {lastTx.amount} ETH</p>
            <p><strong>TxHash:</strong> {lastTx.txHash}</p>
            <p><strong>Time:</strong> {lastTx.timestamp}</p>
          </>
        )}
        <p><strong>Current Balance:</strong> {balance} ETH</p>
        <Button variant="primary" className="me-2" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
        <Button variant="secondary" onClick={() => navigate("/history")}>
          View History
        </Button>
      </Card>
    </Container>
  );
};

export default Success;
