<script lang="ts">
  import { onMount } from "svelte";

  let client: string;
  let host = "";
  let ws: WebSocket;
  let connected = false;
  let status = false;

  onMount(() => {
    if (location.protocol === "https:") {
      alert("HTTPS is not supported. The app will refresh to use HTTP.");
      location.href = location.href.replace("https", "http");
    }

    const params = new URLSearchParams(location.search);
    const localStorage = window.localStorage;

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
      }
    };
    ws.onclose = () => {
      connected = false;
      alert("Connection closed.");
    };
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

  function reboot() {
    ws.send("reboot");
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
    <span>Client {client} ({connected ? "Connected" : "Disconnected"})</span>

    <input
      type="text"
      id="host"
      bind:value={host}
      placeholder="Camera IP/Hostname"
    />

    <button id="reset" on:click={reset}>Reset</button>

    <button id="reload" on:click={reload}>Reload Feed</button>

    <button id="reconnect" on:click={wsConnect}>Reconnect Server</button>

    <button id="on" on:click={on} class={status ? "bg" : ""}>Camera On</button>

    <button id="off" on:click={off} class={status ? "" : "bg"}
      >Camera Off</button
    >

    <button id="reboot" on:click={reboot}>Reboot System</button>
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

  input {
    color: black;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  button {
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 2vw;
    font-weight: 600;
  }

  #main {
    display: flex;
    gap: 8px;
  }

  @media (max-aspect-ratio: 20 / 9) {
    #main {
      margin: calc((100vh - ((80vw - 4px) / 16 * 9)) / 2 - 2px) 0;

      iframe {
        width: calc(80vw - 4px);
        height: calc((80vw - 4px) / 16 * 9);
        border: 2px solid white;
      }

      #buttons {
        height: calc((80vw - 4px) / 16 * 9 + 4px);

        button {
          width: calc(20vw - 16px);
        }
      }
    }
  }

  @media (min-aspect-ratio: 20 / 9) {
    iframe {
      width: calc((100vh - 4px) / 9 * 16);
      height: calc(100vh - 4px);
      border: 2px solid white;
    }

    #buttons {
      button {
        width: calc(100vw - ((100vh - 4px) / 9 * 16) - 20px);
      }
    }
  }

  #buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  #reset {
    padding: 0.5rem 1rem;
    font-size: 1vw;
    background: rgba(34, 34, 34, 1);
  }

  #reset:hover {
    background: rgba(34, 34, 34, 0.8);
  }

  #reload {
    background: rgba(0, 123, 255, 1);
  }

  #reload:hover {
    background: rgba(0, 123, 255, 0.8);
  }

  #reconnect {
    background: rgba(254, 199, 37, 1);
  }

  #reconnect:hover {
    background: rgba(254, 199, 37, 0.8);
  }

  #on,
  #off {
    background: rgba(34, 34, 34, 1);
    height: 100%;
  }

  #on.bg {
    background: rgba(99, 185, 71, 1);
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

  #reboot {
    background: rgba(224, 55, 63, 1);
  }

  #reboot:hover {
    background: rgba(224, 55, 63, 0.8);
  }
</style>
