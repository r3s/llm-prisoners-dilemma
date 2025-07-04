import { getMessage } from "./ai";
import { ChatCompletionMessageParam } from "openai/resources";

type Choices = "RED" | "GREEN"

const systemPrompt = `
You are an intelligent being. You are playing a game with another being.
The game awards you points and your goal is to maximize the number of points you get.
Rules of the game are:
- Each player will have to choose one of the two options: "GREEN" or "RED"
- When the game starts, one player will be chosen to start the first pick.
- If both players chooses "GREEN", both players will be awarded 3 points.
- If one player chooses "GREEN" and, other chooses "RED", the one who chose "RED" will get 5 points and the player who chose "GREEN" will get 0 points.
- If both player chooses "RED", each player will get 1 point.
- The game will continue for 10 rounds

To play the game, you will have to strictly follow the instructions:
- You MUST always reply with either "GREEN" or "RED"
- You MUST look at all the previous messages and devise a strategy
- YOU MUST NEVER reply anything other than "GREEN" or "RED"
`;


// The competing models
const model1 = "openrouter/cypher-alpha:free";
const model2 = "deepseek/deepseek-r1-0528-qwen3-8b:free";

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(0), 500);
  });
}

function pickPlayerOrder() {
  return Math.random() > 0.5 ? [model1, model2] : [model2, model1];
}

function calculateScore({ player1Pick, player2Pick }: { player1Pick: Choices; player2Pick: Choices }) {
  if (player1Pick === player2Pick && player1Pick === "GREEN") {
    return [3, 3];
  }

  if (player1Pick === player2Pick && player1Pick === "RED") {
    return [1, 1];
  }

  if (player1Pick === "RED" && player2Pick === "GREEN") {
    return [5, 0];
  }

  return [0, 5];
}

function assertChoice(choice: string | null): choice is Choices {
  return choice === "RED" || choice === "GREEN";
}

async function runGame() {

  const initialMessage: ChatCompletionMessageParam = {
    role: "system",
    content: systemPrompt,
    name: "",
  };

  const players = pickPlayerOrder();

  const MAX_ROUNDS = 10;
  let currentRound = 1;
  let scores = [0, 0];

  const messagesForPlayer1: ChatCompletionMessageParam[] = [initialMessage, {
    role: "user",
    content: `You are starting the game. This is round ${currentRound}. Please pick your choice`,
  }];

  const messagesForPlayer2: ChatCompletionMessageParam[] = [initialMessage];


  console.log("Players ready!");
  console.log("Player 1: ", players[0], " <> Player 2: ", players[1]);

  while (currentRound <= MAX_ROUNDS) {
    console.log("=========================");
    console.log("ROUND : ", currentRound);

    const player1Reply = await getMessage({ messages: messagesForPlayer1, model: players[0] });
    if (!assertChoice(player1Reply)) {
      throw new Error("Invalid reply received from player 1");
    }
    console.log("Player 1: ", player1Reply);
    await sleep();

    messagesForPlayer2.push({
      role: "user",
      content: `This is round ${currentRound}. Player 1 picked ${player1Reply}. Please pick your choice`,
    });

    const player2Reply = await getMessage({ messages: messagesForPlayer2, model: players[1] });
    if (!assertChoice(player2Reply)) {
      throw new Error("Invalid message received from player 2");
    }
    console.log("Player 2: ", player2Reply);

    const roundScore = calculateScore({ player1Pick: player1Reply, player2Pick: player2Reply });
    scores = [scores[0] + roundScore[0], scores[1] + roundScore[1]];
    await sleep();


    messagesForPlayer1.push({
      role: "user",
      content: `Player 2 picked ${player2Reply} for round ${currentRound}. Please pick your choice for round ${currentRound + 1}`,
    });
    console.log("==========================");
    currentRound += 1;
  }

  console.log("GAME OVER! SCORES BELOW");
  console.log(`Player 1 ${players[0]} : `, scores[0]);
  console.log(`Player 2 ${players[1]} : `, scores[1]);
}

runGame();
