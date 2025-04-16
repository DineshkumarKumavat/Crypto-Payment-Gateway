import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("ganache");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordMap = {
    "0x47736490Af84933f811683d93BF463a19d445438": "ps",
    "0x0d037f9a53776a39277FbAA7EAB8023f47476D26": "ps",
    "0xf76e24391cD4Ac77068AD7aA63c925329e8FF132": "ps",
    "0x9368C100E4497aB2728a9b09bAe56B6dee381E49": "ps",
    "0x188AC94E65A393561C9019dc96463acFB324ebE0": "ps",
    "0x23fD6eFE8969A00615cA3554E792b07777cbc683": "ps",
    "0xa30D2b7f36dd7b5462aCC5E93Bbea53538bF544A": "ps"
  };

  useEffect(() => {
    const loadGanacheAccounts = async () => {
      if (mode === "ganache") {
        try {
          const web3 = new Web3("http://127.0.0.1:7545");
          const accs = await web3.eth.getAccounts();
          setAccounts(accs);
        } catch (err) {
          console.error(err);
          setError("Failed to connect to Ganache.");
        }
      }
    };
    loadGanacheAccounts();
  }, [mode]);

  const handleGanacheLogin = () => {
    setError("");

    if (!selectedAccount) {
      setError("Please select an account.");
      return;
    }

    const expectedPassword = passwordMap[selectedAccount];
    if (!expectedPassword || password !== expectedPassword) {
      setError("Invalid password.");
      return;
    }

    localStorage.setItem("activeAccount", selectedAccount);
    localStorage.setItem("loginMode", "ganache");
    onLogin(selectedAccount);
    navigate("/products");
  };

  const handleMetaMaskLogin = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }

    try {
      // Prompt user to switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
      });

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const metaAccount = accounts[0];

      localStorage.setItem("activeAccount", metaAccount);
      localStorage.setItem("loginMode", "metamask");
      onLogin(metaAccount);
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("MetaMask login failed or user rejected network switch.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h2 className="mb-3">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Choose Login Method</Form.Label>
          <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="ganache">Ganache</option>
            <option value="metamask">MetaMask</option>
          </Form.Select>
        </Form.Group>

        {mode === "ganache" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Ganache Account</Form.Label>
              <Form.Select
                onChange={(e) => setSelectedAccount(e.target.value)}
                defaultValue=""
              >
                <option disabled value="">Select an address</option>
                {accounts.map((acc, idx) => (
                  <option key={idx} value={acc}>{acc}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button onClick={handleGanacheLogin}>Login with Ganache</Button>
          </>
        )}

        {mode === "metamask" && (
          <Button variant="warning" onClick={handleMetaMaskLogin}>
            Connect MetaMask Wallet
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default Login;
