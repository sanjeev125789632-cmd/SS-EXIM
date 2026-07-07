// auth.js — Auth0 Universal Login (self-contained)
// Wrapped in an async IIFE so top-level await works in a plain <script>.
(async function () {
  const auth0Client = await auth0.createAuth0Client({
    domain: "dev-gz5x4jbp1iliog2j.us.auth0.com",
    clientId: "SbO2Rxc0LDXZchH4hGiCBS98f2wYcUNs",
    authorizationParams: {
      redirect_uri: "https://ss-exim.com"
    }
  });

  // Handle the redirect back from Auth0 after login
  if (location.search.includes("code=") && location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const statusEl = document.getElementById("authStatus");

  // Trigger login (Google will appear on the Universal Login page)
  if (loginBtn) {
    loginBtn.onclick = () => auth0Client.loginWithRedirect();
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.onclick = () =>
      auth0Client.logout({ logoutParams: { returnTo: "https://ss-exim.com" } });
  }

  // Reflect current auth state in the UI
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    if (statusEl) statusEl.textContent = "Logged in as " + (user?.name || user?.email || "user");
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (statusEl) statusEl.textContent = "Not logged in";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
})();
