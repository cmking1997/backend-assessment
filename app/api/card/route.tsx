import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Following sets up DB connection to MongoDB
const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_CONNETION_URI as string);
const collection = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME).collection("account");

export async function GET() {
  const headerList = await headers();
  const cardNumber = headerList.get("cardNumber") as string;
  // Resanitize card number
  const sanitizedCardNumber = cardNumber.replace(/-/g, '').replace(/ /g, '');
  if (
    !(
      sanitizedCardNumber.length === 16 &&
      sanitizedCardNumber.match(/^[0-9a-z]+$/)
    )
  ) {
    return NextResponse.json(
      { error: "Error: Card Validation" },
      {
        status: 500,
      }
    );
  }
  console.log(`BEGIN | User Request For Card Number: ${cardNumber}`); // Logging for future troubleshooting
  await client.connect();
  return await collection
    .aggregate([{ $match: { cardNumber: cardNumber } }]) // Match any account entries with this cardNumber
    .toArray()
    .then((results) => {
      const balanceToReturn = results[0]?.balance; // Return minimal information to UI to ensure less impactful Man-in-the-Middle attacks
      console.log(`END | Balance Response: ${balanceToReturn}`); // Logging for future troubleshooting
      return NextResponse.json({
        balance: balanceToReturn
      }, {
        status: 200,
      });
    })
    .catch((error) => console.error(error));
}