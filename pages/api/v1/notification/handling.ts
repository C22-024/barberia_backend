import { firestore } from "../../../../firebase/firebase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const orderId = req.body.order_id;
    const transactionStatus = req.body.transaction_status;
    if (req.body === null) {
      return res.status(400).json({ message: "body tidak boleh kosong" });
    }

    if (orderId === undefined) {
      return res.status(400).json({ message: "order_id tidak boleh kosong" });
    }

    const doc = await firestore.collection("appointments").doc(orderId).get();
    let newDoc = doc.data();

    if (newDoc != undefined) {
      newDoc.status.updatedAt = Date.now();
      if (transactionStatus != undefined) {
        switch (transactionStatus) {
          case "capture":
          case "settlement":
            newDoc.status.code = "paid";
            break;
          case "expire":
            newDoc.status.code = "autoCanceled";
            break;
          default:
            break;
        }
      }

      await firestore.collection("appointments").doc(orderId).set(newDoc);

      return res.status(200).json({ message: "OK", data: newDoc });
    }

    return res.status(200).json({ message: "Gagal update database firestore" });
  }
  return res.status(200).json({ message: "OK", method: method });
}
