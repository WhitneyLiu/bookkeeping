import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import URL from "../config/URLConfig";
import { Button } from '@chakra-ui/react'

const headCells = [
  {
    id: "date",
    numeric: false,
    label: "Date",
    width: 200,
  },
  {
    id: "vendor",
    numeric: false,
    label: "Vendor",
    width: 200,
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
    width: 200,
  },
  {
    id: "amount",
    numeric: true,
    //sortable: true,
    label: "Amount",
    width: 100,
  },
  {
    id: "url",
    numeric: false,
    label: "Image",
    width: 200,
  },
  {
    id: "delete",
    numeric: false,
    label: "",
    width: 100,
  },
];

export default function Table({ setImg, receipts }) {
  const [data, setData] = useState(null);

  async function getDocs() {
    const extractedData = receipts.map((receipt) => ({
      amount: receipt.analyzedResults.total_amount,
      description: (() => {
        const items = receipt.analyzedResults.line_items;
        let qxi = items.map(
          (item) => `${item.quantity || 1} x ${item.description}`
        );
        return (
          <ul>
            {qxi.map((detail) => (
              <li>{detail}</li>
            ))}
          </ul>
        );
      })(),
      date: (() => {
        const dateString = receipt.analyzedResults.invoice_date;
        return dateString;
      })(),
      vendor: receipt.analyzedResults.supplier_name,
      url: (
        <img
          src={receipt.imageURL}
          alt="receipt photo"
          onClick={() => setImg(receipt.imageURL)}
          width="200"
          height="200"
        />
      ),
      delete: (
        <Button variant="contained" onClick={() => handleClick(receipt._id)}>
          Delete
        </Button>
      ),
    }));
    setData(extractedData);
    // window.location.reload();
  }

  async function deletRequest(id) {
    try {
      const JWT = sessionStorage.getItem("bookKeepingCredential");
      await axios.delete(URL + "receipts/" + id, {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      });
      alert("Receipt removed successfully!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert(error.message);
    }
  }

  //Calls function only once (when it is onMount)
  function handleClick(id) {
    deletRequest(id);
  }

  useEffect(() => {
    getDocs();
  }, [receipts]);

  return (
    data && (
      <div>
        {/* {data.length > 0 && (
          <SmartTable
            data={data}
            headCells={headCells}
            // url="/api/admin/emails"
            searchDebounceTime={800}
            // noPagination
          />
        )} */}
      </div>
    )
  );
}
