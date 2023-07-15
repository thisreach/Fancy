import { Client, ActivityType, PresenceStatusData, PresenceData, ActivitiesOptions } from 'discord.js';

class PresenceManager {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async setPresence(): Promise<void> {

    const options = [
      {
        type: ActivityType.Listening,
        text: `Estou ajudando ${this.client.users.cache.size} membros no discord.`,
        status: "dnd"
      },
      {
        type: ActivityType.Watching,
        text: "A melhor performance de bot para o seu servidor.",
        status: "online"
      }
    ];

    const option = Math.floor(Math.random() * options.length);

    const presenceData: PresenceData = {
      activities: [{
        name: options[option].text,
        type: options[option].type as ActivitiesOptions['type'],
      }],
      status: options[option].status as PresenceStatusData,
    };

    this.client.user?.setPresence(presenceData);
  }
}

export default PresenceManager;
