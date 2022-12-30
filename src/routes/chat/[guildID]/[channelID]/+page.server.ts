import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  return {
    channel: await (await fetch(`/api/channels/${params.channelID}`)).json()
  };
}