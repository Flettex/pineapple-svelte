<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import GuildSideBar from "./guildSideBar.svelte";
  import ChannelSideBar from "./channelSideBar.svelte";

  import { decode, encode } from "cbor-x";
  import * as uuid from "uuid";

  import {
    MAIN_CHANNEL,
    MAIN_GUILD,
    sysmsg,
    SYSTEM_AUTHOR,
  } from "$lib/constants";
  import {
    logs,
    selectedChannel,
    selectedGuild,
    socket,
    userCache,
    userData,
    fetched
  } from "$lib/stores";
  import type { IGuild, IMessage } from "$lib/types";
  import GuildCreateModal from "./guildCreateModal.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import ChannelCreateModal from "./channelCreateModal.svelte";
	import JoinGuildModal from "./joinGuildModal.svelte";

  let disconnecting: boolean = false;

  // let logRef;
  let statusRef: HTMLSpanElement;
  let textInputRef: HTMLInputElement;
  // let nameRef;

  onMount(async () => {
    await connect();
    selectedGuild.subscribe(({ id }) => {
      goto(`/chat/${id}/${$selectedChannel.id}`)
    });

    selectedChannel.subscribe(({ id }) => {
      goto(`/chat/${$selectedGuild.id}/${id}`)
    });
  });

  $: console.log("changed guild to", $selectedGuild);
  $: console.log("changed channel to", $selectedChannel);
  $: {
    if ($selectedChannel.id !== MAIN_CHANNEL.id) {
      if (!$fetched.channels.includes($selectedChannel.id) && $socket) {
        $socket.sendQueued(encode({
          type: "MessageFetch",
          data: {
            channel_id: uuid.parse($selectedChannel.id)
          }
        }));
        fetched.update((fetched) => ({
          ...fetched,
          channels: [...fetched.channels, $selectedChannel.id]
        }));
      }
    }
  }

  function fix(o: any): object {
    for (let [k, v] of Object.entries(o)) {
      if (ArrayBuffer.isView(v)) {
        o[k] = uuid.stringify(v as Uint8Array);
      } else if (typeof v === "object" && !Array.isArray(v) && v !== null) {
        o[k] = fix(v);
      } else if (Array.isArray(v)) {
        v.forEach((e, ind) => {
          o[k][ind] = fix(e);
        });
      }
    }
    return o;
  }

  socket.subscribe((sock) => {
    if (sock) {
      sock.onmessage = (ev) => {

        const event = decode(new Uint8Array(ev.data));

        for (let [k, v] of Object.entries(event.data || {})) {
          if (ArrayBuffer.isView(v)) {
            event.data[k] = uuid.stringify(v as Uint8Array);
          } else if (typeof v === "object" && !Array.isArray(v) && v !== null) {
            event.data[k] = fix(v);
          } else if (Array.isArray(v)) {
            v.forEach((e, ind) => {
              event.data[k][ind] = fix(e);
            });
          }
        }

        console.log(event.type, event);

        if (event.type === "MemberCreate") {
          userData.update((usrd) => {
            if (!usrd) return null;
            let newGuilds = [...(usrd.guilds as IGuild[])];
            let found = newGuilds.findIndex(
              (g) => g.id === event.data.guild.id
            );
            if (found !== -1) {
              newGuilds[found] = {
                ...newGuilds[found],
                members: [
                  ...newGuilds[found].members,
                  {
                    ...event.data.member,
                    user_id: BigInt(event.data.member.user_id),
                  },
                ],
              };
            } else {
              newGuilds.push({
                ...event.data.guild,
                members: [],
              });
            }
            return {
              user: usrd.user,
              guilds: newGuilds,
            };
          });
        } else if (event.type === "MemberRemove") {
          // broken atm
        } else if (event.type === "MessageUpdate") {
          logs.update((logs) => {
            return {
              ...logs,
              [event.data.channel_id]: [
                ...(logs[event.data.channel_id] ?? []),
              ].map((m) => {
                if (m.id === event.data.id) {
                  event.data.nonce = undefined;
                  event.data.received = true;
                  return event.data;
                }
                return m;
              }),
            };
          });
        } else if (event.type === "MessageCreate") {
          // console.log(JSON.stringify(event.data.author), userData?.user.id);
          if (event.data.author.id == $userData?.user.id) {
            logs.update((logs) => {
              // find the message with the nonce
              return {
                ...logs,
                [event.data.channel_id]: [
                  ...(logs[event.data.channel_id] ?? []),
                ].map((m) => {
                  if (m.nonce === event.data.nonce) {
                    event.data.received = true;
                    return event.data;
                  }
                  return m;
                }),
              };
            });
          } else {
            try_user(event.data.author.id);
            log(event.data);
          }
        } else if (event.type === "GuildCreate") {
          userData.update((usrd) => ({
            user: usrd!.user,
            guilds: [
              ...(usrd!.guilds as IGuild[]),
              {
                ...event.data.guild,
                channels: event.data.guild.channels ?? [],
                members: event.data.guild.members ?? [],
              },
            ],
          }));
        } else if (event.type === "ChannelCreate") {
          userData.update((usrd) => ({
            user: usrd!.user,
            guilds: [...(usrd!.guilds as IGuild[])].map((g) =>
              g.id === event.data.channel.guild_id
                ? {
                    ...g,
                    channels: [...(g.channels ?? []), event.data.channel],
                  }
                : {
                    ...g,
                  }
            ),
          }));
        } else if (event.type === "ReadyEvent") {
          userData.set({
            user: {
              ...event.data.user,
              id: BigInt(event.data.user.id),
            },
            guilds: event.data.guilds.map((g: IGuild) => {
              // console.log(g.id, stringify(g.id as any));
              return {
                ...g,
                members: [],
              };
            }),
          });
          userCache.update((cache) => ({
            ...cache,
            [event.data.user.id + ""]: event.data.user,
          }));
          console.log("USER DATA", $userData);
        } else if (event.type === "Messages") {
          logs.update((logs) => ({
            ...logs,
            [event.data.channel_id]: [
              ...(logs[event.data.channel_id] || []),
              ...event.data.messages.map((m: any) => {
                return {
                  id: m.id,
                  content: m.content,
                  created_at: m.created_at,
                  edited_at: m.edited_at,
                  channel_id: m.channel_id,
                  author: [
                    try_user(m.author_id),
                    {
                      id: BigInt(m.author_id),
                    },
                  ][1],
                };
              }),
            ],
          }));
        } else if (event.type === "Members") {
          userData.update((usrd) => {
            let newGuilds = [...(usrd!.guilds as IGuild[])];
            let found = newGuilds.findIndex(
              (g) => g.id === event.data.guild_id
            );
            if (found !== -1) {
              newGuilds[found] = {
                ...newGuilds[found],
                members: [
                  ...newGuilds[found].members,
                  ...event.data.members.map((m: any) => ({
                    ...m,
                    user_id: BigInt(m.user_id),
                  })),
                ],
              };
            } else {
              throw new Error(
                "Bro wtf receiving members event before the guild initialized dude what"
              );
            }
            return {
              user: usrd!.user,
              guilds: [...(usrd!.guilds as IGuild[])],
            };
          });
        } else if (event.type === "UserFetch") {
          userCache.update((cache) => ({
            ...cache,
            [event.data.id + ""]: event.data,
          }));
        } else if (event.type === "ErrorUnauthorized") {
          goto("/login");
        } else {
          console.log("Unhandled event", event.type, "Data: ", event.data);
        }
      };

      sock.onclose = (ev) => {
        console.log(ev.code);
        if (ev.code === 10008) alert("Unauthorized");
        log(sysmsg("Disconnected", $selectedChannel.id));
        socket.set(null);
        disconnecting = false;
      };
    }
    if (!statusRef || !textInputRef) return;
    if (sock) {
      statusRef.style.backgroundColor = "transparent";
      statusRef.style.color = "green";
      statusRef.textContent = `connected`;
      textInputRef.focus();
    } else {
      statusRef.style.backgroundColor = "red";
      statusRef.style.color = "white";
      statusRef.textContent = "disconnected";
    }
  });

  socket.subscribe((sock) => {
    if (sock) {
      if ($selectedChannel.id == MAIN_CHANNEL.id) return;
      if (!$fetched.channels.includes($selectedChannel.id)) {
        sock.sendQueued(
          encode({
            type: "MessageFetch",
            data: {
              channel_id: uuid.parse($selectedChannel.id),
            },
          })
        );
        fetched.update((fetched) => ({
          ...fetched,
          channels: [...fetched.channels, $selectedChannel.id]
        }));
      }
    }
  });

  socket.subscribe((sock) => {
    if (sock) {
      if ($selectedGuild.id == MAIN_GUILD.id) return;
      if (!$fetched.guilds.includes($selectedGuild.id)) {
        sock.sendQueued(
          encode({
            type: "MemberFetch",
            data: {
              guild_id: uuid.parse($selectedGuild.id),
            },
          })
        );
        fetched.update((fetched) => ({
          ...fetched,
          guilds: [...fetched.guilds, $selectedGuild.id]
        }));
      }
    }
  });

  // $: {
  //   if (logRef) {
  //     logRef.scrollTop += 1000;
  //   }
  // }

  async function connect() {
    if ($socket) {
      if (disconnecting) {
        alert("Be patient I'm tryna disconnect");
        return;
      }
      disconnecting = true;
      log(sysmsg("Disconnecting...", $selectedGuild.id));
      $socket?.close();
    } else {
      // const { location } = window;

      // await fetch("/api/samesite");
      // const proto = location.protocol.startsWith("https") ? "wss" : "ws";
      // const wsUri = "ws://localhost:8080/ws";
      const wsUri = "ws://localhost:5173/ws";
      // const wsUri = "wss://flettex-backend.fly.dev/ws";

      log(sysmsg("Connecting...", $selectedGuild.id));
      let websocket: any = new WebSocket(wsUri);
      let queue: (string | ArrayBufferLike | Blob | ArrayBufferView)[] = [];
      websocket.binaryType = "arraybuffer";
      websocket.onopen = () => {
        log(sysmsg("Connected", $selectedChannel.id));
        queue.forEach((d) => websocket.send(d));
      };
      websocket.sendQueued = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
        if (websocket.readyState === 1) {
          websocket.send(data);
        } else {
          queue.push(data);
        }
      }
      socket.set(websocket);
    }
  }

  function try_user(id: bigint) {
    if ($userCache.hasOwnProperty(id + "")) return;
    if ($fetched.users.includes(id)) return;
    ((cache) => {
      if (
        cache.hasOwnProperty(id + "") &&
        !$userCache.hasOwnProperty(id + "") &&
        !$fetched.users.includes(id)
      ) {
        fetched.update((fetched) => ({
          ...fetched,
          users: [...fetched.users, id]
        }));
        $socket?.send(
          encode({
            type: "UserFetch",
            data: {
              id,
            },
          })
        );
      }
    })(userCache);
  }

  function log(msg: IMessage): void {
    logs.set({
      ...$logs,
      [msg.channel_id]: [...($logs[msg.channel_id] ?? []), msg],
    });
  }
</script>

<div class="flex gap-1">
  <GuildSideBar />
  <ChannelSideBar />

  <div class="flex flex-col bg-gray-300 dark:bg-gray-700 m-0 h-full w-full overflow-hidden">
    <div>
      <Button on:click={connect}>
        {$socket ? "Disconnect" : "Connect"}
      </Button>
      <div>GUILD: {$selectedGuild.name} {$selectedGuild.id}</div>
      <div>CHANNEL: {$selectedChannel.name} {$selectedChannel.id}</div>
      <span>Status:</span>
      <span bind:this={statusRef}>disconnected</span>
    </div>

    <slot />

    <form
      on:submit|preventDefault={() => {
        if (!textInputRef || !$socket) return;

        const text = textInputRef.value;

        const nonce = uuid.v4();
        console.log("sending message...");

        log({
          id: "NOT_RECEIVED",
          content: text,
          created_at: Date.now(),
          edited_at: Date.now(),
          author: $userData?.user || SYSTEM_AUTHOR,
          channel_id: $selectedChannel.id,
          nonce,
        });
        $socket.send(
          encode({
            type: "MessageCreate",
            data: {
              content: text,
              channel_id: $selectedChannel.id,
              nonce: uuid.parse(nonce),
            },
          })
        );

        textInputRef.value = "";
        textInputRef.focus();
      }}
    >
      <input type="text" bind:this={textInputRef} />
      <Button type="submit">Submit</Button>
    </form>

    <GuildCreateModal {log} />
    <ChannelCreateModal {log} />
    <JoinGuildModal {log} />

    <hr />
  </div>
</div>
