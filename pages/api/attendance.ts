// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { DateTime } from "luxon";
type Data = {
  success: boolean;
  apiResponse?: any;
  msg: any;
  totalScanDayWise: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    console.log("req.body", req.body);

    const inputValues = [req.body];
    let responseMsg;
    const client_email =
      "torontomadrasaattendance@torontomadrasa.iam.gserviceaccount.com";
    const private_key =
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDN8hi0xDooQOmW\nauhCOSEn8tT+kBVEtW6AdNyo+ylorez6cmtMc7hGzr3ZIqF/DYXooX5rnjJfYiaD\ntzv+sIticr7ZBj7PARTlCYYLOwEG7LOBwzNUE/yMmEdTid1OyqbhnjRzLbzDtLQd\nzVNchBpY+3Myv0DfIS2BotPwuor9ciD5dk6N9heytFCnf/+Tb13K/lmBZ8s4zgDA\nPr88NWcila8agrnKZsfZRZFajUG6iwVR6fV2o6QAjAeXYMVUmcPMNYZWhjCejI4l\noIFavltHJrpKfoVHE6mFcuzIrOnU06jaOT+KFfLJHO0GTn5K0jwWzEY5K31FXhMX\nP6ALIAoLAgMBAAECggEAEAOLOEMp4odponCdrsiSc3DGbyT1Amq5NPPhVKJzDdi4\nXKEZBtDYu2jICmJO/Hoot3YXRnb+o7wWEpfk6mD/9Z/Gh0mdCKuk3EppSeZEpi0x\nqB1tmFQVhzkwEqbdtoq7fz+2BF7CFtWuS8LzgHYlNlYXFxMYEEGcMEBhCo72z840\nUklHS9b6xIdVHi6C6EKLwwsK5D/7oItC5Gl1pDOmjtLXXeqjJAByKHm5aZEnXnFZ\nbStZIxvg4Hbqf8lBTIfcwi5mlfY1J9GS0u7jA/VUmioVrRE9fjHCjFWyfcKpwTnw\noa2BhWnY7gyVh0g0B4upAwSTQ6em6Jz1LrBWAowsgQKBgQDw2nnNmWcx9Y5bjQrb\nEus0qhdJbTjzGYnq50hfkE1HgBWYwrq3U060RcWUBHmt+BVfCIQVc5INK7ifIlkk\nScfi8y9+YXlwJtKpXCghItUBvRtdvSYVnMBGs8a5a9tz1HnvBqsOe3QU6WTb+E5g\nusrodh2ZDbiIaLdLq7k5m7mPKQKBgQDa5aM0vf0VYwVSdxxFhKm8VtCpO2xWsGbg\nadLnoC/sEcB6xpm9aNkSueLCGA61IuAnxIlTbh6msEPJYFhabARzbsR8SM1/3RCR\nXuKThECHyAAd5p48QKr1mjNK5mfKM5sjvfKAe8aFdvPEgKa7HRr9sOD/i1pQE4Pt\nA4/PLpZaEwKBgBENZtJHqia/W/TfZ4VbMYvo/v0T3pRXmownE9iwPshxKRZHszCH\nlWruBa8VIghPKDQyRie+pviHv+qEZAtNrflDfnlULWTjWsbi33R5Itucp/NbEPc2\nweY/lDJMkJ0Czh8+OZ4s32sbmyh3zBTNJNCQjEfp0MbXoyKYZeTOQbUBAoGBANO4\n+5P/E7TE8xfhZ3ICMB6gJfEaLd7nfoofMUSiVtfSD8dxIrDmodeP/jlYBZnEIuW0\nHlOZFoKJyPcVfj/vbJquD9RaopHDI8xH54VhjP0IQLyrHHAQ6Irn3CbdFpSoN61p\ngw4tKkZbWMq+2QXwz/ODSw1BH1iGl7r/D/EIEZsLAoGAMgPAv1uGbYGMBAgbuE4r\ncJDulMIyrgtF4ePSSRrFANEujXer4fSyaMjRlImz21+dM983tWxTXQVXt289n5vC\naCNlieCJ76aap3JRRj8oUlsXH8lx3PCl+n5n6bO6bc+CkZrf7u+dK6U2FdwH0a4j\nAhsTP9SnAuEF+j8n2x9YgIU=\n-----END PRIVATE KEY-----\n";
    const spreadsheetId = "1hX474XLot9Pw0cP2oLX_l8pmuJX_9Kzhkpq5iVhNOH8";
    const sheetName = "Attendance sheet";

    const updatedValues = (values: any[][] | null | undefined): any => {
      if (values === null || typeof values === "undefined") {
        return values;
      } else {
        // Do something with values
        return values.map((r: any) => {
          if (inputValues.includes(r[0])) {
            responseMsg = "Attendance successfully marked";
            return [
              r[0],
              r[1],
              r[2],
              r[3],
              r[4],
              "Present",
              DateTime.now().toFormat("tt"),
            ];
          } else {
            return r;
          }
        });
      }
    };

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email,
          private_key,
        },
        scopes: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/spreadsheets",
        ],
      });

      const sheets = google.sheets({
        auth,
        version: "v4",
      });

      const {
        data: { values },
      } = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName,
      });

      const status = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: sheetName,
        includeValuesInResponse: true,
        requestBody: {
          values: updatedValues(values),
        },
        valueInputOption: "USER_ENTERED",
      });

      const totalScanDayWise = (data: any) => {
        let scannedStudents: any[] = [];
        data?.data?.updatedData?.values.filter((row: any) => {
          if (row[4] === "Present") {
            scannedStudents.push(row);
          }
        });
        return scannedStudents.length;
      };

      res.status(200).json({
        success: true,
        apiResponse: status ?? "",
        msg: responseMsg ?? "ITS not found",
        totalScanDayWise: totalScanDayWise(status),
      });
    } catch (error: any) {
      console.error("error", error);
      res.status(500).send(error);
    }
  }
}
