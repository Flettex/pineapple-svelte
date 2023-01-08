import { MAIN_CHANNEL } from "$lib/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  if (params.channelID === MAIN_CHANNEL.id) {
    return {
      channel: MAIN_CHANNEL
    }
  }
  return {
    channel: await (await fetch(`/api/channels/${params.channelID}`)).json()
  };
}