import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

const wordToGuess = "créteil";

const baseUrl = "https://nlp.polytechnique.fr";

async function getSimilarityScore(word: string): Promise<number> {
    const body = {
        sim1: wordToGuess,
        sim2: word,
        lang: "fr",
        type: "General Word2Vec",
    };
    const response = await fetch(baseUrl + "/similarityscore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const { simscore } = await response.json();
    return Number(simscore);
}

async function extractGuess(req: Request): Promise<string> {
    const payload = await req.formData();
    const guess = payload.get("text")?.toString();
    if (!guess) {
        throw new Error("Guess is empty or null");
    }
    return guess;
}

async function handler(req: Request): Promise<Response> {
    const guess = await extractGuess(req);
    const score = await getSimilarityScore(guess);
    return new Response(`Your guess score is : ${score.toFixed(2)}`);
}

serve(handler);
