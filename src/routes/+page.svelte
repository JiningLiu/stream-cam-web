<script lang="ts">
  import { onMount } from "svelte";

  let localStorageLength = 0;
  let client: string;
  let host = "";
  let ws: WebSocket;
  let connected = false;
  let status = false;

  onMount(() => {
    if (location.protocol === "https:") {
      alert(
        "HTTPS is not supported. The app will refresh to use HTTP.\nIf the error persists, please manually change the protocol in the address bar from HTTPS to HTTP."
      );
      location.href =
        "http://" + location.hostname + location.pathname + location.search;
      return;
    }

    const params = new URLSearchParams(location.search);

    client = params.get("client") || "";

    if (client === "") {
      if (localStorage.length === 0) {
        alert("Creating new client. Page will refresh to add new parameter.");
        location.href = "?client=0";
        return;
      }

      alert(
        "Attempting last client. Page will refresh to add client parameter."
      );
      location.href = "?client=" + (localStorage.length - 1);
      return;
    }

    const storedHost = localStorage.getItem(client);

    if (storedHost === null) {
      host = prompt("Camera IP/Hostname") || "";
      if (host !== "") {
        localStorage.setItem(client, host);
      }
    } else {
      host = storedHost;
    }

    localStorageLength = localStorage.length;

    reload();
    wsConnect();
  });

  function wsConnect() {
    localStorage.setItem(client, host);
    ws = new WebSocket("ws://" + host + ":3000");
    ws.onopen = () => {
      connected = true;
      ws.send("status");
    };
    ws.onmessage = (event) => {
      if (event.data === "on") {
        status = true;
      } else if (event.data === "off") {
        status = false;
      } else {
        return;
      }
      reload();
    };
    ws.onclose = () => {
      connected = false;
      alert("Connection closed.");
    };
  }

  function handleClientChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value === "") {
      location.href = "?client=" + localStorageLength;
    } else {
      location.href = "?client=" + value;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      wsConnect();
    }
  }

  function reload() {
    (document.getElementById("stream") as HTMLIFrameElement).src =
      "http://" + host + ":8889/cam";
  }

  function on() {
    ws.send("on");
  }

  function off() {
    ws.send("off");
  }

  function overlay() {
    window?.open(`${location.protocol}//${location.hostname}:8000`, "_blank")?.focus();
  }

  function update() {
    ws.send("update");
  }

  function reboot() {
    if (confirm("Reboot Camera?")) {
      ws.send("reboot");
    }
  }

  function shutdown() {
    if (confirm("Shutdown Camera?")) {
      ws.send("shutdown");
    }
  }

  function reset() {
    if (confirm("Reset? This will remove all clients.")) {
      localStorage.clear();
      location.href = "?client=0";
    }
  }
</script>

<div id="main">
  <iframe id="stream" title="Live Stream" src="" frameborder="0" />

  <div id="buttons">
    <div class="hstack">
      <span id="client">
        Client
        <select
          on:change={handleClientChange}
          on:mousedown={() => {
            localStorageLength = localStorage.length;
          }}
        >
          <option value="">New...</option>
          <optgroup label="Existing Clients">
            {#each Array.from({ length: localStorageLength }, (_, i) => i) as i}
              <option value={i} selected={client === i.toString()}
                >{i}{client === i.toString()
                  ? ""
                  : " - " + localStorage.getItem(i.toString())}</option
              >
            {/each}
          </optgroup>
        </select>
        <b>{connected ? "Connected" : "Disconnected"}</b></span
      >
    </div>

    <input
      type="text"
      id="host"
      bind:value={host}
      placeholder="Camera IP/Hostname"
      on:keydown={handleKeydown}
    />

    <div class="hstack">
      <button id="reload" on:click={reload}>Reload Feed</button>

      <button id="reconnect" on:click={wsConnect}>Reconnect Server</button>
    </div>

    <button id="on" on:click={on} class={status ? "bg" : ""}
      >Camera {status ? "is" : ""} On</button
    >

    <button id="off" on:click={off} class={status ? "" : "bg"}
      >Camera {status ? "" : "is"} Off</button
    >

    <button id="overlay" on:click={overlay}>Overlay</button>

    <div class="hstack">
      <button id="reset" on:click={reset}>Clear</button>

      <button id="update" on:click={update}>Update</button>
    </div>

    <div class="hstack">
      <button id="reboot" on:click={reboot}>Reboot</button>

      <button id="shutdown" on:click={shutdown}>Shutdown</button>
    </div>
  </div>
</div>

<style lang="scss">
  :global(body) {
    color: white;
    background: black;
    font-family:
      "Helvetica Neue",
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      sans-serif;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  select,
  input {
    color: white;
    background: rgba(34, 34, 34, 1);
    border: white 1px solid;
    padding: 0.25rem 0.5rem;
  }

  button {
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }

  #main {
    display: flex;
    gap: 8px;
  }

  @media (max-aspect-ratio: 20 / 9) {
    #main {
      margin: calc((100vh - ((80vw - 4px) / 16 * 9)) / 2 - 2px) 8px;

      iframe {
        width: calc(80vw - 4px);
        height: calc((80vw - 4px) / 16 * 9);
        border: 2px solid white;
      }

      #buttons {
        height: calc((80vw - 4px) / 16 * 9 + 4px);

        #client,
        input {
          font-size: 0.75vw;
        }

        select {
          max-width: 6vw;
        }

        input {
          width: calc(20vw - 34px);
          border-radius: 0.25vw;
        }

        button {
          width: calc(20vw - 16px);
          font-size: 2vw;
          padding: 0.75vw 1.5vw;
          border-radius: 0.5vw;
        }

        #overlay,
        #reset,
        #update,
        #reload,
        #reconnect,
        #reboot,
        #shutdown {
          font-size: 1vw;
          padding: 0.375vw 0.75vw;
        }

        #reset,
        #update,
        #reload,
        #reconnect,
        #reboot,
        #shutdown {
          width: calc(10vw - 12px);
        }
      }
    }
  }

  @media (min-aspect-ratio: 20 / 9) {
    #main {
      margin: 8px;
    }

    iframe {
      width: calc((100vh - 16px - 4px) / 9 * 16);
      height: calc(100vh - 16px - 4px);
      border: 2px solid white;
    }

    #buttons {
      #client,
      input {
        font-size: 1.5vh;
      }

      select {
        max-width: 24vh;
      }

      input {
        width: calc((100vw - 16px - ((100vh - 16px - 4px) / 9 * 16)) - 18px);
        border-radius: 0.75vh;
      }

      button {
        font-size: 4vh;
        padding: 1.5vh 3vh;
        border-radius: 1vh;
      }

      #overlay,
      #reset,
      #update,
      #reload,
      #reconnect,
      #reboot,
      #shutdown {
        font-size: 2vh;
        padding: 0.75vh 1.5vh;
      }

      #reset,
      #update,
      #reload,
      #reconnect,
      #reboot,
      #shutdown {
        width: calc((100vw - 16px - ((100vh - 16px - 4px) / 9 * 16)) / 2 - 4px);
      }
    }
  }

  #buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hstack {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  #reload {
    background: rgba(0, 123, 255, 0.2);
  }

  #reload:hover {
    background: rgba(0, 123, 255, 1);
  }

  #reconnect {
    background: rgba(254, 199, 37, 0.2);
  }

  #reconnect:hover {
    background: rgba(254, 199, 37, 1);
  }

  #on,
  #off {
    background: rgba(34, 34, 34, 1);
    height: 100%;
  }

  #on.bg {
    background: rgba(99, 185, 71, 1);
  }

  #overlay {
    background: rgba(0, 123, 255, 0.2);
  }

  #on:hover {
    background: rgba(99, 185, 71, 0.8);
  }

  #off.bg {
    background: rgba(247, 130, 28, 1);
  }

  #off:hover {
    background: rgba(247, 130, 28, 0.8);
  }

  #reset:hover {
    background: rgba(34, 34, 34, 0.8);
  }

  #overlay:hover {
    background: rgba(0, 123, 255, 1);
  }

  #reset,
  #update,
  #reboot,
  #shutdown {
    background: rgba(224, 55, 63, 0.2);
  }

  #reset:hover,
  #update:hover,
  #reboot:hover,
  #shutdown:hover {
    background: rgba(224, 55, 63, 1);
  }
</style>
