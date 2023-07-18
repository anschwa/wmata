// app.js

const handleLogout = () => {
  if (!window.confirm("Delete API Key and logout?")) {
    return;
  }

  deleteApiKey();
  window.location.reload();
};

document.addEventListener("DOMContentLoaded", (event) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return renderLogin();
  };

  renderMain();
});

const renderLogin = () => {
  const tmpl = g("#loginTmpl").content.cloneNode(true);

  const form = tmpl.querySelector("form");
  const input = form.querySelector(`input[name="apiKey"]`);
  const btn = form.querySelector(`button[type="submit"]`);

  input.addEventListener("blur", (e) => {
    const apiKey = e.target.value;

    btn.disabled = apiKey.length === 0;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const apiKey = new FormData(e.target).get("apiKey");

    const response = await fetch(
      "https://api.wmata.com/Misc/Validate",
      {
        headers: {
          "api_key": apiKey,
        },
      },
    );

    if (!response.ok) {
      const { message } = await response.json();
      window.alert(message);
      return;
    }

    setApiKey(apiKey);
    renderMain();
  });

  g("main").replaceChildren(tmpl);
};

const renderMain = () => {
  const tmpl = g("#stopSearchTmpl").content.cloneNode(true);

  show("nav");
  g("main").replaceChildren(tmpl);
};

const getApiKey = () => {
  return localStorage.getItem("apiKey");
};

const setApiKey = (apiKey) => {
  localStorage.setItem("apiKey", apiKey);
};

const deleteApiKey = () => {
  localStorage.removeItem("apiKey");
};

const show = (selector) => {
  return g(selector).classList.remove("hidden");
};

const hide = (selector) => {
  return g(selector).classList.add("hidden");
};

const g = (selector) => {
  return document.querySelector(selector);
};
