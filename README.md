## Prisoner's dilemma for AI

This is a very simple 10 round simulation of Prisoner's dilemma for LLMs
You can make two models play against each other and the scores are printed at the end.

##### Rules of the game
- Each player picks RED or GREEN
- If both players pick RED, they get 1 point each
- If both players pick GREEN, they get 3 points each
- If one player picks RED and the other GREEN, the one who chose RED gets 5 points


##### Dependencies
The code is build with OpenRouter API, so you will need an OpenRouter API key
Set the `OPENROUTER_API_KEY` environment variable with your key

##### How to run
- Run `npm i` to install dependencies
- Set the preferred models in `main.ts`
- Run `npm run build && npm start` to run the simulation


The models may send replies which are not in accordance to the system prompt
