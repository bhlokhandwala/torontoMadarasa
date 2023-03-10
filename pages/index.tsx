import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

type DataType = { [key: string]: any };

export default function Home() {
  const [setting, setSetting] = useState({
    title: "",
    attendanceColumn: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [countMsg, setCountMsg] = useState("0");
  const [classCountMsg, setClassCountMsg] = useState<DataType>({});
  const [its, setIts] = useState("");
  const [qrCode, setQrCode] = useState("No result");

  const fetchTodos = async () => {
    const response = await fetch("/api/settings");
    const data = await response.json();
    setSetting({
      title: data.data.values[0][1],
      attendanceColumn: data.data.values[1][1],
    });
  };

  const markAttendance = async (its: string) => {
    setSuccessMsg("Loading");
    const response = await fetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify({
        its: its,
        attendanceColumn: setting.attendanceColumn,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setSuccessMsg(data.msg);
    setCountMsg(data.totalScanDayWise);

    if (data?.success) {
      setIts("");
      if (data?.scannedStudents) {
        const arr_map = data?.scannedStudents.reduce(
          (a: { [x: string]: any }, k: string | number) => (
            (a[k] = (a[k] || 0) + 1), a
          ),
          {}
        );
        setClassCountMsg(Object.fromEntries(Object.entries(arr_map).sort()));
      } else {
        setClassCountMsg({});
      }
    }
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
        <title>{setting?.title}</title>
        <meta name="description" content={setting?.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="sm" sx={{ height: "100vh" }}>
        <Typography variant="h4" gutterBottom>
          {setting?.title}
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

        {Object.keys(classCountMsg).map((keyName, i) => (
          <li key={i}>
            <span>
              {keyName.slice(0, -8)} = {classCountMsg[keyName]}
            </span>
          </li>
        ))}
        <Typography variant="subtitle1" gutterBottom>
          Total number of Student Scanned {countMsg}
        </Typography>
      </Container>
    </>
  );
}
