addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(event) {
  const { request } = event;
  const { pathname } = new URL(request.url);
  const method = request.method;

  if (method == "GET" && pathname.startsWith("/health")) {
    return new Response("👌", { status: 200 });
  }

  if (method == "POST" && pathname.startsWith("/api/webhooks/sonar-cloud")) {
    const requestBody = await request.text();
    const body = JSON.parse(requestBody);

    const analysedAt = new Date(body.analysedAt).toLocaleTimeString("de-DE");

    const message =
`SonarCloud at ${analysedAt}
Project[key=${body.project.key}, name=${body.project.name}]
${body.branch.url}
${body.status} in ${parseRef(body.branch.name)}`;

    return sendMessage(message);
  }

  if (method == "POST" && pathname.startsWith("/api/webhooks/github")) {
    const requestBody = await request.text();
    const body = JSON.parse(requestBody);

    const updatedAt = new Date(body.repository.updated_at).toLocaleTimeString("de-DE");

    const message =
`GitHub at ${updatedAt}
Project: ${body.repository.full_name}
${body.repository.html_url}
PUSH in ${parseRef(body.ref)} by ${body.sender.login}`;

    return sendMessage(message);
  }

  if (method == "POST" && pathname.startsWith("/api/webhooks/quay")) {
    const requestBody = await request.text();
    const body = JSON.parse(requestBody);

    const updatedAt = new Date().toLocaleTimeString("de-DE");

    const message =
`Quay at ${updatedAt}
Repository: ${body.repository}
${body.homepage}
DOCKER_PUSH in ${parseRef(body.updated_tags)}`;

    return sendMessage(message);
  }

  if (method == "POST" && pathname.startsWith("/api/webhooks/artifact-hub")) {
    const requestBody = await request.text();
    const body = JSON.parse(requestBody);

    const updatedAt = new Date().toLocaleTimeString("de-DE");

    const package = body.data.package;

    const message =
`ArtifactHUB at ${updatedAt}
Repository: ${package.name}
${package.url}
HELM_PUSH in ${parseRef(package.version)}`;

    return sendMessage(message);
  }

  return fetch("https://welcome.developers.workers.dev");
}

function parseRef(ref) {
  const tagRef = "refs/tags/";
  const headRef = "refs/heads/";
  const versionRef = /v\d+.\d+.\d+/;

  if (ref.startsWith(tagRef)) {
    ref = ref.substring(tagRef.length)
  }
  if (ref.startsWith(headRef)) {
    ref = ref.substring(headRef.length)
  }
  if (versionRef.test(headRef)) {
    ref = ref.substring(1);
  }
  return ref;
}

function sendMessage(message) {
    const messageEncoded = encodeURIComponent(message);
    const telegramFetch =  getTelegramFetch(messageEncoded);
    fetch(telegramFetch);

    return new Response(message, {
      headers: { "Content-Type": "text/plain" },
    });
}

function getTelegramFetch(text) {
  const telegramBotSendMessage = "/sendMessage?chat_id=" + TELEGRAM_USER_ID + "&text=" + text;
  return "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + telegramBotSendMessage;
}
