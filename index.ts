import { RGBot } from "rg-bot";
import RGCTFUtils, { CTFEvent } from "rg-ctf-utils";
import { Vec3 } from "vec3";

/**
 * This strategy is the simplest example of how to get started 
 * with the rg-bot and rg-ctf-utils packages. The Bot will get 
 * the flag and then run back to base to score.
 * 
 * Ways to extend this code:
 * TODO: What happens when a bot is completing an action and 
 *       another event happens?
 * TODO: How do we respond to item spawn and drop events?
 * TODO: How do we target and attach enemies?
 * TODO: What different states is my bot in, and how can I organize
 *       its behavior based on these states?
 * rg-bot docs: https://github.com/Regression-Games/RegressionBot/blob/main/docs/api.md
 * rg-ctf-utils docs: https://github.com/Regression-Games/rg-ctf-utils
 */
export function configureBot(bot: RGBot) {

  // Since most blocks can't be broken on Arctic Algorithm Field,
  // don't allow digging while pathfinding
  bot.allowDigWhilePathing(false);

  // Instantiate our helper and events for Capture the Flag
  const rgctfUtils = new RGCTFUtils(bot);

  // When a player types "start" in the chat, the bot will begin
  // looking for and approaching the flag
  bot.on('chat', async (username: string, message: string) => {
    if (username === bot.username()) return;
    if (message === 'start') {
      bot.chat("Going to start capturing the flag!")
      await rgctfUtils.approachFlag()
    }
  })

  // When a player obtains the flag, this event gets called.
  // In the case where that player is this bot, the bot
  // navigates back to their scoring location.
  bot.on(CTFEvent.FLAG_OBTAINED, async (collector: string) => {
    if (collector == bot.username()) {
      await rgctfUtils.scoreFlag()
    }
  });

  // If the flag was scored, simply chat a message
  bot.on(CTFEvent.FLAG_SCORED, async (teamName: string) => {
    bot.chat(`Flag scored by ${teamName} team, waiting until it respawns`)
  })

  // Once the flag respawns on the map, look for and approach the flag.
  bot.on(CTFEvent.FLAG_AVAILABLE, async (position: Vec3) => {
    bot.chat("Flag is available, going to get it")
    await rgctfUtils.approachFlag();
  })

}