import axios from "axios";

// API connection help file so we don't have to redo the headers and response portion each time in future
export const searchCardAPI = async (cardNumber: string) =>
  axios.get("/api/card", { headers: { cardNumber } })
    .then((response) => response);