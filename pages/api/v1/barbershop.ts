import { firestore } from "../../../firebase/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

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

type Geopoint = {
  _latitude: number;
  _longitude: number;
};

type Location = {
  geohash: string;
  geopoint: Geopoint;
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
    address: "string",
    completedAppointmentCount: 0,
    reviewCount: 0,
    photoPath: "string",
    location: {
      geohash: "string",
      geopoint: {
        _latitude: 0,
        _longitude: 0,
      },
    },
    name: "string",
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
    await firestore.collection("barbershops").doc(id).set(req.body);

    return res.status(200).json({ message: "OK", id: id, data: req.body });
  }
  return res.status(200).json({ message: "OK", method: method });
}
