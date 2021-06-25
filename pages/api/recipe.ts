import { NextApiRequest, NextApiResponse } from "next";

export default async function EdamamRecipeSearchAPI(req: NextApiRequest, res: NextApiResponse) {
    // parse result for Engati bot.
    res.json({ data: { type: "text", text: "This project is still worked on, come back later!" } });
}
