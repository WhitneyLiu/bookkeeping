import { useEffect, useState } from "react";
import Title from "./Title";
import UploadForm from "./UploadForm";
import Table from "./Table";
import Modal from "./Modal";
import URL from "../config/URLConfig";
import axios from "axios";
import { Button } from '@chakra-ui/react'

function Home() {
  const [img, setImg] = useState(null);
  const [receipts, setReceipts] = new useState([]);
  const [amount, setAmount] = new useState(0);

  async function fetchRecords() {
    const JWT = sessionStorage.getItem("bookKeepingCredential");
    const rawRecords = await axios.get(URL + "receipts", {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    setReceipts(rawRecords.data.receiptRecords);
    setAmount(rawRecords.data.expenseSummary.expenseSum);
  }

  const handleLogout = () => {
    sessionStorage.removeItem("bookKeepingCredential");
    window.location.href = "/Login";
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    receipts && (
      <div className="App">
        <div className="Log-off">
          <Button variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
        <Title amount={amount} />
        <UploadForm />
        <Table setImg={setImg} receipts={receipts} />
        {img && <Modal src={img} setImg={setImg} />}
      </div>
    )
  );
}

export default Home;
