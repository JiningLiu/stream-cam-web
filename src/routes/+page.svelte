<script lang="ts">
  import { onMount } from "svelte";

  let host = "localhost";
  let ws: WebSocket;

  onMount(() => {
    const params = new URLSearchParams(location.search);
    const localStorage = window.localStorage;

    const client = params.get("client");

    if (client === null) {
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
      host = prompt("Camera IP/Hostname") || "localhost";
      localStorage.setItem(client, host);
    } else {
      host = storedHost;
    }

    (document.getElementById("stream") as HTMLIFrameElement).src =
      "http://" + host + ":8889/cam";
    ws = new WebSocket("wss://" + host + ":3000");
    ws.onmessage = (event) => {
      console.log(event.data);
    };
    ws.onerror = () => {
      alert("Connection error. Refreshing page.");
      location.reload();
    };
    ws.onclose = () => {
      alert("Connection closed. Refreshing page.");
      location.reload();
    };
    ws.send("status");
  });

  function reload() {
    (document.getElementById("stream") as HTMLIFrameElement).src =
      "http://" + host + ":8889/cam";
  }

  function reconnect() {
    ws = new WebSocket(ws.url);
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
</script>

<div id="main">
  <iframe id="stream" title="Live Stream" src="" frameborder="0" />

  <div id="buttons">
    <button id="reload" on:click={reload}>Reload Feed</button>

    <button id="reconnect" on:click={reconnect}>Reconnect Server</button>

    <button id="on" on:click={on}>Camera On</button>

    <button id="off" on:click={off}>Camera Off</button>

    <button id="reboot" on:click={reboot}>Reboot System</button>
  </div>
</div>

<style lang="scss">
  :global(body) {
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

  button {
    color: white;
    border: none;
    padding: 0.5rem 1rem;
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

    button {
      height: 100%;
    }
  }

  #reload {
    background: rgba(0, 123, 255, 1);
  }

  #reload:hover {
    background: rgba(0, 123, 255, 0.8);
  }

  #reconnect {
    background: rgba(165, 80, 166, 1);
  }

  #reconnect:hover {
    background: rgba(165, 80, 166, 0.8);
  }

  #on {
    background: rgba(99, 185, 71, 1);
  }

  #on:hover {
    background: rgba(99, 185, 71, 0.8);
  }

  #off {
    background: rgba(254, 199, 37, 1);
  }

  #off:hover {
    background: rgba(254, 199, 37, 0.8);
  }

  #reboot {
    height: 50%;
    background: rgba(224, 55, 63, 1);
  }

  #reboot:hover {
    background: rgba(224, 55, 63, 0.8);
  }
</style>
