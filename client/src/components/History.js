import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

const History = () => {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("txHistory") || "[]");
    setTxs(history.reverse());
  }, []);

  return (
    <Container className="mt-5">
      <h2>Transaction History</h2>
      {txs.length === 0 && <p>No transactions found.</p>}
      {txs.map((tx, idx) => (
        <Card key={idx} className="p-3 mb-3 shadow-sm">
          <p><strong>Product:</strong> {tx.product}</p>
          <p><strong>From:</strong> {tx.from}</p>
          <p><strong>To:</strong> {tx.to}</p>
          <p><strong>Amount:</strong> {tx.usd ? `$${tx.usd}` : "—"} / {tx.eth} ETH</p>
          <p><strong>TxHash:</strong> {tx.txHash}</p>
          <p><strong>Time:</strong> {tx.timestamp}</p>
        </Card>
      ))}
    </Container>
  );
};

export default History;
