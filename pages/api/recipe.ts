import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

type Nulled = null | undefined;
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

function toUppercase(text: string): string {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
}

function isNone(data: any): data is Nulled {
    return data === null || typeof data === "undefined";
}

function walk(data: any, keys: string) {
    const allKeys = keys.split(".");
    allKeys.forEach((key) => {
        if (isNone(data)) {
            return;
        }
        if (!isNaN(parseInt(key))) {
            data = data[parseInt(key)];
        } else {
            data = data[key];
        }
    });
    return data;
}

function randRange(total: number) {
    let range = Math.floor(Math.random() * (total - 1) + 1);
    if (range < 1) {
        range = 1;
    } else if (range >= total) {
        range = total;
    }
    return range - 1;
}

function getRandom<T>(toRandom: T[], hits: number = 1): T[] {
    if (!Array.isArray(toRandom)) {
        return [];
    }
    if (toRandom.length < 1) {
        return [];
    }
    if (toRandom.length < hits) {
        return toRandom;
    }
    const randomData = [];
    for (let i = 0; i < hits; i++) {
        const num = randRange(toRandom.length);
        const got = toRandom[num];
        randomData.push(got);
        toRandom = toRandom.filter((_, idx) => idx !== num);
    }
    return randomData;
}

interface CarouselButton {
    payload: string;
    title: string;
    type: string;
}

interface CarouselAction {
    url: string;
    type: string;
}

interface CarouselEngati {
    title: string;
    subtitle: string;
    image_url?: string;
    buttons?: CarouselButton[];
    default_action: CarouselAction;
}

function formatToCarousel(allHits: ResultHits[]) {
    const formattedHits = [] as CarouselEngati[];
    allHits.forEach((recipeHit) => {
        const { recipe } = recipeHit;
        let formatSubtitle = "";
        formatSubtitle += `Total Calories: ${recipe.calories.toFixed(
            2
        )} kcal | Total Weight: ${recipe.totalWeight.toFixed(2)}gr`;
        let mealTypes = [];
        const mealType = (walk(recipe, "mealType") as string[]) || [];
        mealType.forEach((e: string) => {
            const splitAt = e.split("/");
            mealTypes = mealTypes.concat(splitAt);
        });
        mealTypes = mealTypes.map((e) => toUppercase(e));
        formatSubtitle += `\nFor ${mealTypes.join(", ")}`;
        let dishType = (walk(recipe, "dishType") as string[]) || [];
        dishType = dishType.map((e) => toUppercase(e));
        formatSubtitle += `\nDish Type: ${dishType.join(", ")}`;
        const formatHit: CarouselEngati = {
            title: recipe.label,
            subtitle: formatSubtitle,
            image_url: recipe.image,
            buttons: [
                {
                    payload: recipe.shareAs,
                    type: "web_url",
                    title: "More Info",
                },
            ],
            default_action: {
                url: recipe.shareAs,
                type: "web_url",
            },
        };
        formattedHits.push(formatHit);
    });
    return formattedHits;
}

async function fetchAPI(hits: number = 1) {
    const request = await axios.get<EdamamAPIResult>(`https://api.edamam.com/api/recipes/v2`, {
        headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip",
        },
        params: {
            type: "public",
            app_id: process.env.EDAMAM_APP_ID,
            app_key: process.env.EDAMAM_APP_SECRET,
            imageSize: "REGULAR",
            diet: "low-fat",
            calories: "0-400",
        },
        responseType: "json",
    });
    const edamamResponse = request.data;
    const allHitsFiltered = edamamResponse.hits.filter((e) => {
        let addIt = true;
        [
            "Alcohol-cocktail",
            "drinks",
            "desserts",
            "pancakes",
            "preps",
            "side dish",
            "side-dish",
            "sweets",
            "condiments and sauces",
        ].forEach((nOMEGALUL) => {
            const dishTypes = (walk(e, "recipe.dishType") as string[]) || [];
            if (dishTypes.includes(nOMEGALUL)) {
                addIt = false;
            }
        });
        return addIt;
    });
    return formatToCarousel(getRandom(allHitsFiltered, hits));
}

export default async function EdamamRecipeSearchAPI(req: NextApiRequest, res: NextApiResponse) {
    let hitTotal = req?.query?.hits as string | undefined;
    if (isNone(hitTotal)) {
        hitTotal = "3";
    }
    let parsedHitsInt = parseInt(hitTotal);
    if (isNaN(parsedHitsInt)) {
        parsedHitsInt = 3;
    }
    if (parsedHitsInt < 1) {
        parsedHitsInt = 1;
    }
    if (parsedHitsInt > 10) {
        parsedHitsInt = 10;
    }
    try {
        const recipes = await fetchAPI(parsedHitsInt);
        res.json({ data: { type: "carousel", templates: recipes } });
    } catch (e) {
        if (e.response) {
            console.error("An error occured!");
            console.error(JSON.stringify(e.response.data, undefined, 2));
        } else {
            console.error(e);
        }
        res.status(500).json({
            data: { type: "text", text: "An error occured while trying to get a recipe." },
        });
    }
}
