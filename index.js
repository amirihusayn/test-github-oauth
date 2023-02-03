const WORKER_URL = "https://api.amirihusayn.ir";
const code = new URL(location.href).searchParams.get("code");
const $login = document.querySelector("#login");

if (code) {
  login(code);
}
else {
  document.getElementById('message').innerHTML = 'No login code found. You need to login first.'
  document.getElementById('loading').style.visibility = 'invisible';
}

async function login(code) {
  // remove ?code=... from URL
  const path =
    location.pathname +
    location.search.replace(/\b(code|state)=\w+/g, "").replace(/[?&]+$/, "");
  history.replaceState({}, "", path);

  document.body.dataset.state = "loading";

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ code })
    });

    const result = await response.json();

    if (result.error) {
      return alert(JSON.stringify(result, null, 2));
    }

    const { Octokit } = await import("https://cdn.skypack.dev/@octokit/core");
    const octokit = new Octokit({ auth: result.token });

    const {
      data: { login },
    } = await octokit.request("GET /user");
    alert("Hi there, " + login);
    document.getElementById('loading').style.visibility = 'invisible';

  } catch (error) {
    alert(error);
    location.reload();
  }
}