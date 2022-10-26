<script lang="ts">
  import { encode, decode } from "cbor-x";
  import * as uuid from "uuid";

  import Button from "$lib/components/button.svelte";
  import {
    Tab,
    TabContent,
    TabGroup,
    TabList,
    TabPanels,
  } from "$lib/components/tabs";
  import type {
    IGuild,
    IChannel,
    IUser,
    IUserData,
    IMessage,
  } from "$lib/types";
  import GuildCreateModal from "./guildCreateModal.svelte";

  const MAIN_GUILD: IGuild = {
    id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
    name: "Main",
    created_at: 0,
    creator_id: -1,
    channels: [],
    members: [],
  };

  const MAIN_CHANNEL: IChannel = {
    id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
    name: "Main",
    position: -1,
    created_at: 0,
    guild_id: "5fe9d2ab-2174-4a30-8245-cc5de2563dce",
  };

  const SYSTEM_AUTHOR: IUser = {
    id: BigInt(0),
    username: "System",
    created_at: 1467969011,
    is_staff: true,
    is_superuser: true,
  };

  function sysmsg(content: string, id: string): IMessage {
    return {
      id: "",
      content: content,
      created_at: 0,
      edited_at: 0,
      channel_id: id,
      author: SYSTEM_AUTHOR,
      nonce: "",
    };
  }

  let socket: WebSocket | null = null;
  let disconnecting: boolean = false;
  let logs: { [key: string]: IMessage[] } = {};
  let userData: IUserData | null = null;
  let userCache: { [key: string]: IUser } = {
    "0": SYSTEM_AUTHOR,
  };
  let fetched: {
    channels: string[];
    guilds: string[];
    users: bigint[];
  } = {
    channels: [],
    guilds: [],
    users: [],
  };
  let guild = MAIN_GUILD;
  let channel = MAIN_CHANNEL;
  // let logRef;
  let statusRef: HTMLSpanElement;
  let textInputRef: HTMLInputElement;
  // let nameRef;

  const setGuild = (data: any) => (guild = data);

  const setChannel = (data: any) => (channel = data);

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

  $: {
    if (socket) {
      socket.onopen = () => {
        log(sysmsg("Connected", channel.id));
      };

      socket.onmessage = (ev) => {
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

        if (event.type === "MemberCreate") {
          userData = ((usrd) => {
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
          })(userData);
        } else if (event.type === "MemberRemove") {
          // broken atm
        } else if (event.type === "MessageUpdate") {
          logs = ((logs) => {
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
          })(logs);
        } else if (event.type === "MessageCreate") {
          // console.log(JSON.stringify(event.data.author), userData?.user.id);
          console.log("msg create", event.data);
          if (BigInt(event.data.author.id) === userData?.user.id) {
            logs = ((logs) => {
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
            })(logs);
          } else {
            try_user(event.data.author.id);
            log(event.data);
          }
        } else if (event.type === "GuildCreate") {
          userData = ((usrd) => ({
            user: usrd!.user,
            guilds: [
              ...(usrd!.guilds as IGuild[]),
              {
                ...event.data.guild,
                channels: event.data.guild.channels ?? [],
                members: event.data.guild.members ?? [],
              },
            ],
          }))(userData);
        } else if (event.type === "ChannelCreate") {
          userData = ((usrd) => ({
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
          }))(userData);
        } else if (event.type === "ReadyEvent") {
          userData = {
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
          };
          userCache = ((cache) => ({
            ...cache,
            [event.data.user.id + ""]: event.data.user,
          }))(userCache);
          console.log(userData);
        } else if (event.type === "Messages") {
          logs = ((logs) => ({
            ...logs,
            [event.data.channel_id]: [
              ...(logs[event.data.channel_id] || []),
              ...event.data.messages.map((m: any) => {
                // console.log("AUTHOR_ID:", m.author_id);
                return {
                  id: m.id,
                  content: m.content,
                  // content: (userData!.guilds.find((g) =>
                  // 	g.channels.find((c) => c === event.data.channel_id) ? true : false)
                  // 		?.members.find((mem) => mem.user_id === m.author_id)
                  // 			?.nick_name ?? ([try_user(m.author_id), userCache[m.author_id]][1] as IUser | undefined)?.username ?? m.author_id) + ": " + m.content,
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
          }))(logs);
        } else if (event.type === "Members") {
          userData = ((usrd) => {
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
          })(userData);
        } else if (event.type === "UserFetch") {
          userCache = ((cache) => ({
            ...cache,
            [event.data.id + ""]: event.data,
          }))(userCache);
        } else {
          console.log("Unhandled event", event.type, "Data: ", event.data);
        }
      };

      socket.onclose = () => {
        log(sysmsg("Disconnected", channel.id));
        socket = null;
        disconnecting = false;
      };
    }
    if (!statusRef || !textInputRef) break $;
    if (socket) {
      statusRef.style.backgroundColor = "transparent";
      statusRef.style.color = "green";
      statusRef.textContent = `connected`;
      textInputRef.focus();
    } else {
      statusRef.style.backgroundColor = "red";
      statusRef.style.color = "white";
      statusRef.textContent = "disconnected";
    }
  }

  $: {
    if (socket) {
      if (channel.id == MAIN_CHANNEL.id) break $;
      if (!fetched.channels.includes(channel.id)) {
        socket.send(
          encode({
            type: "MessageFetch",
            data: {
              channel_id: uuid.parse(channel.id),
            },
          })
        );
        fetched.channels.push(channel.id);
      }
    }
  }

  $: {
    if (socket) {
      if (guild.id == MAIN_GUILD.id) break $;
      if (!fetched.guilds.includes(guild.id)) {
        socket.send(
          encode({
            type: "MemberFetch",
            data: {
              guild_id: uuid.parse(guild.id),
            },
          })
        );
        fetched.guilds.push(guild.id);
      }
    }
  }

  // $: {
  //   if (logRef) {
  //     logRef.scrollTop += 1000;
  //   }
  // }

  async function connect() {
    if (socket) {
      if (disconnecting) {
        alert("Be patient I'm tryna disconnect");
        return;
      }
      disconnecting = true;
      log(sysmsg("Disconnecting...", channel.id));
      socket.close();
    } else {
      // const { location } = window;

      // await fetch("/api/samesite");
      // const proto = location.protocol.startsWith("https") ? "wss" : "ws";
      const wsUri = "ws://localhost:8080/ws";
      // const wsUri = "wss://flettex-backend.fly.dev/ws";

      log(sysmsg("Connecting...", channel.id));
      let websocket = new WebSocket(wsUri);
      websocket.binaryType = "arraybuffer";
      socket = websocket;
    }
  }

  function try_user(id: bigint) {
    if (userCache.hasOwnProperty(id + "")) return;
    if (fetched.users.includes(id)) return;
    ((cache) => {
      if (
        cache.hasOwnProperty(id + "") &&
        !userCache.hasOwnProperty(id + "") &&
        !fetched.users.includes(id)
      ) {
        fetched.users.push(id);
        socket?.send(
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
    logs = {
      ...logs,
      [msg.channel_id]: [...(logs[msg.channel_id] ?? []), msg],
    };
  }
</script>

<div>
  <Button on:click={connect}>
    {socket ? "Disconnect" : "Connect"}
  </Button>
  <div>GUILD: {guild.name} {guild.id}</div>
  <div>CHANNEL: {channel.name} {channel.id}</div>
  <span>Status:</span>
  <span bind:this={statusRef}>disconnected</span>
</div>

<!-- <div>{JSON.stringify(userCache[1])}</div> -->
<TabGroup defaultIndex={0}>
  <TabList aria-label="choose a guild">
    <Tab
      value={MAIN_GUILD.id}
      on:click={() => [setChannel(MAIN_CHANNEL), setGuild(MAIN_GUILD)]}>Main</Tab>
    {#if userData}
      {#each userData.guilds as g (g.id)}
        <Tab
          class="border border-black rounded-sm m-1"
          on:click={() => {
            console.log("clicked")
            setGuild(g)
            setChannel(
              userData?.guilds?.find((gd) => gd.id == g.id)?.channels?.[0] ||
                MAIN_CHANNEL
            )
          }}
        >
          {#if g.icon}
            <img src={g.icon} alt={g.name} width={50} height={50} />
          {:else}
            {g.name}
          {/if}
        </Tab>
      {/each}
    {/if}
  </TabList>

  <TabPanels>
    <TabContent value={MAIN_GUILD.id}>
      {#each logs[MAIN_CHANNEL.id] ?? [] as i}
        <div>
          {userCache[i.author.id + ""]?.username}: {i.content}
          {i.created_at !== i.edited_at ? "(edited)" : ""}
        </div>
      {/each}
    </TabContent>
    {#if userData}
      {#each userData.guilds as g (g.id)}
        <TabContent
          key={g.id}
          value={g.id}
          on:click={() => [
            setGuild(g),
            setChannel(
              userData?.guilds?.find((gd) => gd.id == g.id)?.channels?.[0] ||
                MAIN_CHANNEL
            ),
          ]}
        >
          <Tab defaultValue={g.channels?.[0]?.id} orientation="horizontal">
            <TabList aria-label="choose a guild">
              {#if userData}
                {#each userData.guilds.find((g) => g.id === guild.id)?.channels || [] as c (c.id)}
                  <Tab value={c.id} key={c.id} onClick={() => setChannel(c)}>
                    {c.name}
                  </Tab>
                {/each}
              {/if}
            </TabList>
            {#each Object.entries(logs) as [k, m]}
              <TabContent key={k} value={k}>
                {#each m as i}
                  <!-- style={{color: i.author.id === userData?.user.id ? (i.id !== "NOT_RECEIVED" ? undefined : "gray") : undefined}} -->
                  <div
                    on:dblclick={() => {
                      if (
                        i.author.id !== BigInt(userData?.user.id || 0) ||
                        i.channel_id == MAIN_CHANNEL.id
                      )
                        return;
                      const inp = prompt("New content");
                      if (!inp) return;
                      socket?.send(
                        encode({
                          type: "MessageUpdate",
                          data: {
                            id: uuid.parse(i.id),
                            content: inp,
                            nonce: uuid.parse(i.nonce || MAIN_GUILD.id),
                          },
                        })
                      );
                    }}
                  >
                    {userCache[i.author.id + ""]?.username || i.author.id}: {i.content}
                    {i.created_at !== i.edited_at ? "(edited)" : ""}
                  </div>
                {/each}
              </TabContent>
            {/each}
          </Tab>
        </TabContent>
      {/each}
    {/if}
  </TabPanels>
</TabGroup>

<form
  on:submit|preventDefault={() => {
    if (!textInputRef || !socket) return;

    const text = textInputRef.value;

    const nonce = uuid.v4();
    console.log("sending message...");

    log({
      id: "NOT_RECEIVED",
      content: text,
      created_at: Date.now(),
      edited_at: Date.now(),
      author: userData?.user || SYSTEM_AUTHOR,
      channel_id: channel.id,
      nonce,
    });
    socket.send(
      encode({
        type: "MessageCreate",
        data: {
          content: text,
          channel_id: channel.id,
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

<GuildCreateModal bind:socket={socket} bind:channel={channel} log={log} sysmsg={sysmsg} />
<!-- <ButtonGroup>
  <ModalGuild />
  <ModalChannel />
  <ModalJoinGuild />
</ButtonGroup> -->

<hr />
<!-- <Table /> -->
