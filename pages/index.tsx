import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [title, setTitle] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [countMsg, setCountMsg] = useState("0");
  const [its, setIts] = useState("");
  const [qrCode, setQrCode] = useState("No result");

  const fetchTodos = async () => {
    const response = await fetch("/api/title");
    const data = await response.json();
    setTitle(data.name);
  };

  const markAttendance = async (its: string) => {
    setSuccessMsg("Loading");
    const response = await fetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify(its),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    if (data?.success) {
      setSuccessMsg(data.msg);
      setCountMsg(data.totalScanDayWise);
      setIts("");
    }
  };

  const resetScanner = () => {
    setQrCode("No result");
    setSuccessMsg("");
    setIts("");
  };

  useEffect(() => {
    if (qrCode !== "No result") {
      markAttendance(qrCode);
    }
  }, [qrCode]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="sm" sx={{ height: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <TextField
          id="standard-basic"
          label="ITS"
          placeholder="Enter ITS"
          variant="standard"
          value={its}
          onChange={(e) => setIts(e.target.value)}
        />
        <Button
          disabled={!its}
          onClick={() => markAttendance(its)}
          variant="contained"
        >
          Mark Attendance
        </Button>
        <Typography variant="subtitle1" gutterBottom>
          Total number of Student Scanned {countMsg}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {successMsg}
        </Typography>
        <div>
          <QrReader
            onResult={(result: any, error) => {
              if (!!result) {
                setQrCode(result?.text);
              }
              if (!!error) {
                console.info(error);
              }
            }}
            className={styles.qr_reader_layout}
            constraints={{ facingMode: "environment" }}
          />
        </div>
        <Typography variant="subtitle1" gutterBottom>
          {qrCode}
        </Typography>
      </Container>
    </>
  );
}
