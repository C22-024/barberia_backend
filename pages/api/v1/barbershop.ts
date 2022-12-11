import { firestore } from "../../../firebase/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { GeoPoint } from "firebase-admin/firestore";

type OpeningHoursItem = {
  closeTime: number;
  openTime: number;
  isOpen: boolean;
};

type OpeningHours = {
  mon: OpeningHoursItem;
  sun: OpeningHoursItem;
  sat: OpeningHoursItem;
  tue: OpeningHoursItem;
  wed: OpeningHoursItem;
  fri: OpeningHoursItem;
  thu: OpeningHoursItem;
};

type Location = {
  geohash: string;
  geopoint: GeoPoint;
};

type Barbershop = {
  openingHours: OpeningHours;
  address: string;
  completedAppointmentCount: number;
  reviewCount: number;
  photoPath: string;
  location: Location;
  name: string;
  rating: number;
  closedManually: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  let barbershop: Barbershop = {
    openingHours: {
      mon: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      sun: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      sat: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      tue: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      wed: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      fri: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
      thu: {
        closeTime: 0,
        openTime: 0,
        isOpen: false,
      },
    },
    address: "",
    completedAppointmentCount: 0,
    reviewCount: 0,
    photoPath: "",
    location: {
      geohash: "",
      geopoint: new GeoPoint(1, 1),
    },
    name: "",
    rating: 0,
    closedManually: false,
  };

  if (method === "GET") {
    let result: FirebaseFirestore.DocumentData[] = [];
    let barbershopRef = firestore.collection("barbershops");
    const snapshot = await barbershopRef.get();
    snapshot.forEach((doc) => {
      const docData = doc.data();
      if (docData.query === undefined) {
        result.push(doc.data());
      }
    });
    return res.status(200).json({ message: "ok", data: result });
  }

  if (method === "POST") {
    if (req.body === undefined) {
      res.status(400).json({ message: "Silahkan isi bodynya", body: barbershop });
    }
    const id = nanoid(16);
    const barbershopId = `barbershop_${id}`;
    const result = req.body;
    result.location.geopoint = new GeoPoint(req.body.location._latitude, req.body.location._longitude);
    await firestore.collection("barbershops").doc(barbershopId).set(result);

    return res.status(200).json({ message: "OK", barbershopId: barbershopId, data: result });
  }
  return res.status(200).json({ message: "OK", method: method });
}
