import { NextApiRequest, NextApiResponse } from "next";

export default async function BMICalculatorAPI(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req;
    const { m, h } = query;
    const massKg = parseFloat(m as string);
    const heightCm = parseFloat(h as string);
    if (isNaN(massKg) || isNaN(heightCm)) {
        res.status(400).json({
            data: { type: "text", text: "Sorry, an error occured while trying to get your BMI." },
        });
    } else {
        const heightMeter = heightCm / 100;
        const BMI = massKg / heightMeter ** 2;
        let BMIText = "Underweight";
        if (BMI >= 18.5 && BMI < 25) {
            BMIText = "Normal";
        } else if (BMI >= 25 && BMI < 30) {
            BMIText = "Overweight";
        } else if (BMI >= 30 && BMI < 35) {
            BMIText = "Obese";
        } else if (BMI >= 35) {
            BMIText = "Extremely Obese";
        }
        const textFormat = `Your BMI is ${BMI.toFixed(2)} (${BMIText})`;
        res.json({ data: { type: "text", text: textFormat } });
    }
}
