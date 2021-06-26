import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

type Nullable<T> = T | null;
type Cuisine =
    | "world"
    | "american"
    | "asian"
    | "british"
    | "caribbean"
    | "central europe"
    | "chinese"
    | "eastern europe"
    | "french"
    | "indian"
    | "italian"
    | "japanese"
    | "kosher"
    | "mediterranean"
    | "mexican"
    | "middle eastern"
    | "nordic"
    | "south american"
    | "south east asian";

interface Paginating {
    href: Nullable<string>;
    title: Nullable<string>;
}

interface EdamamPagination {
    next?: Paginating;
    self?: Paginating;
}

interface Intake {
    label: string;
    quantity: number;
    unit: string;
}

interface IntakeData {
    [intake: string]: Intake;
}

interface RecipeIngredient {
    text: string;
    quantity: number;
    measure: string;
    food: string;
    weight: number;
    foodId: string;
}

interface Degisted {
    label: string;
    tag: string;
    schemaOrgTag: string;
    total: number;
    hasRDI: boolean;
    daily: number;
    unit: string;
}

interface RecipeDegist extends Degisted {
    sub: Degisted[];
}

interface EdamamRecipe {
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    shareAs: string;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: RecipeIngredient[];
    calories: number;
    totalWeight: number;
    cuisineType: Cuisine[];
    mealType: string[];
    dishType: string[];
    totalNutrients: IntakeData;
    totalDaily: IntakeData;
    digest: RecipeDegist[];
}

interface ResultHits {
    recipe: EdamamRecipe;
    _links: EdamamPagination;
}

interface EdamamAPIResult {
    from: number;
    to: number;
    count: number;
    _links: EdamamPagination;
    hits: ResultHits[];
}

function getRandom<T>(toRandom: T[]) {
    const total = toRandom.length;
    let range = Math.floor(Math.random() * (total - 1) + 1);
    if (range < 0) {
        range = 0;
    } else if (range >= total) {
        range = total - 1;
    }
    return toRandom[range];
}

async function fetchAPI() {
    const request = await axios.get<EdamamAPIResult>("https://api.edamam.com/api/recipes/v2", {
        headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip",
        },
        params: {
            type: "public",
            app_id: process.env.EDAMAM_APP_ID,
            app_key: process.env.EDAMAM_APP_SECRET,
            imageSize: "REGULAR",
            q: "healthy",
        },
        responseType: "json",
    });
    const edamamResponse = request.data;
    return getRandom(edamamResponse.hits).recipe;
}

export default async function EdamamRecipeSearchAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        const recipe = await fetchAPI();
        res.json({ data: recipe });
    } catch (e) {
        res.status(500).json({
            data: { type: "text", text: "An error occured while trying to get a recipe." },
        });
    }
}
