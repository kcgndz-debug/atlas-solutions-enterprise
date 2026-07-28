(() => {
  "use strict";

  const client = window.atlasSupabase;

  if (!client) {
    console.error(
      "Atlas authentication could not start because the Supabase client is missing."
    );
    return;
  }

  const loginScreen = document.getElementById("atlasLoginScreen");
  const appShell = document.getElementById("atlasAppShell");
  const loginForm = document.getElementById("atlasLoginForm");
  const emailInput = document.getElementById("atlasLoginEmail");
  const passwordInput = document.getElementById("atlasLoginPassword");
  const loginButton = document.getElementById("atlasLoginButton");
  const loginMessage = document.getElementById("atlasLoginMessage");
  const togglePasswordButton =
    document.getElementById("atlasTogglePassword");
  const signOutButton = document.getElementById("atlasSignOutButton");
  const workspaceLabel =
    document.getElementById("atlasCurrentWorkspace");

  function setLoginMessage(message = "", type = "") {
    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.className = "atlas-login-message";

    if (type) {
      loginMessage.classList.add(`atlas-login-message--${type}`);
    }
  }

  function setLoginLoading(isLoading) {
    if (!loginButton) return;

    loginButton.disabled = isLoading;
    loginButton.textContent = isLoading
      ? "Signing in..."
      : "Sign in";
  }

  function showLoginScreen() {
    loginScreen?.classList.remove("atlas-auth-hidden");
    appShell?.classList.add("atlas-auth-hidden");

    document.body.classList.add("atlas-login-active");
    document.body.classList.remove("atlas-user-authenticated");

    setTimeout(() => emailInput?.focus(), 100);
  }

  function showApplication() {
    loginScreen?.classList.add("atlas-auth-hidden");
    appShell?.classList.remove("atlas-auth-hidden");

    document.body.classList.remove("atlas-login-active");
    document.body.classList.add("atlas-user-authenticated");
  }
    async function loadProfile(userId) {
    const { data, error } = await client
      .from("profiles")
      .select(
        [
          "user_id",
          "first_name",
          "last_name",
          "display_name",
          "job_title",
          "is_platform_owner",
          "is_active",
          "preferences"
        ].join(",")
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async function getCurrentAtlasUser() {
    const {
      data: { user },
      error
    } = await client.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      return null;
    }

    const profile = await loadProfile(user.id);

    return {
      user,
      profile
    };
  }

  async function signIn(email, password) {
    const { data, error } =
      await client.auth.signInWithPassword({
        email: email.trim(),
        password
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Atlas could not verify this account.");
    }

    const profile = await loadProfile(data.user.id);

    if (!profile.is_active) {
      await client.auth.signOut();

      throw new Error(
        "This Atlas account is inactive. Contact an administrator."
      );
    }

    return {
      user: data.user,
      session: data.session,
      profile
    };
  }

  async function signOut() {
    const { error } = await client.auth.signOut({
      scope: "local"
    });

    if (error) {
      throw error;
    }
  }
    function applyUserToInterface(account) {
    const profile = account.profile || {};
    const user = account.user;

    const displayName =
      profile.display_name ||
      [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(" ") ||
      user.email ||
      "Atlas User";

    window.atlasCurrentUser = {
      id: user.id,
      email: user.email,
      displayName,
      jobTitle: profile.job_title || "",
      isPlatformOwner: Boolean(profile.is_platform_owner),
      isActive: Boolean(profile.is_active),
      profile
    };

    if (workspaceLabel) {
      workspaceLabel.textContent = profile.is_platform_owner
        ? "Platform Owner"
        : profile.job_title || "Atlas Workspace";
    }

    document.documentElement.dataset.atlasRole =
      profile.is_platform_owner
        ? "platform-owner"
        : "user";

    window.dispatchEvent(
      new CustomEvent("atlas:user-ready", {
        detail: window.atlasCurrentUser
      })
    );
  }

  async function restoreSession() {
    try {
      const account = await getCurrentAtlasUser();

      if (!account) {
        showLoginScreen();
        return;
      }

      if (!account.profile.is_active) {
        await signOut();
        showLoginScreen();

        setLoginMessage(
          "This Atlas account is inactive. Contact an administrator.",
          "error"
        );

        return;
      }

      applyUserToInterface(account);
      showApplication();
    } catch (error) {
      console.error("Atlas session restore failed:", error);
      showLoginScreen();
    }
  }

  loginForm?.addEventListener("submit", async event => {
    event.preventDefault();

    const email = emailInput?.value || "";
    const password = passwordInput?.value || "";

    if (!email || !password) {
      setLoginMessage(
        "Enter your email and password.",
        "error"
      );
      return;
    }

    setLoginLoading(true);
    setLoginMessage("");

    try {
      const account = await signIn(email, password);

      applyUserToInterface(account);
      showApplication();

      loginForm.reset();
      setLoginMessage("");

      console.log(
        "Atlas user authenticated:",
        account.user.email
      );
    } catch (error) {
      console.error("Atlas sign-in failed:", error);

      const message =
        error?.message === "Invalid login credentials"
          ? "The email or password is incorrect."
          : error?.message ||
            "Atlas could not sign you in.";

      setLoginMessage(message, "error");
    } finally {
      setLoginLoading(false);
    }
  });
    togglePasswordButton?.addEventListener("click", () => {
    if (!passwordInput) return;

    const isVisible = passwordInput.type === "text";

    passwordInput.type = isVisible
      ? "password"
      : "text";

    togglePasswordButton.textContent = isVisible
      ? "Show"
      : "Hide";

    togglePasswordButton.setAttribute(
      "aria-label",
      isVisible
        ? "Show password"
        : "Hide password"
    );
  });

  signOutButton?.addEventListener("click", async () => {
    signOutButton.disabled = true;
    signOutButton.textContent = "Signing out...";

    try {
      await signOut();

      window.atlasCurrentUser = null;
      showLoginScreen();

      setLoginMessage(
        "You have been signed out.",
        "success"
      );
    } catch (error) {
      console.error("Atlas sign-out failed:", error);

      alert(
        "Atlas could not sign you out. Please try again."
      );
    } finally {
      signOutButton.disabled = false;
      signOutButton.textContent = "Sign Out";
    }
  });

  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      window.atlasCurrentUser = null;
      showLoginScreen();
    }
  });

  window.atlasAuth = {
    getCurrentAtlasUser,
    loadProfile,
    signIn,
    signOut,
    restoreSession
  };

  restoreSession();

  console.log(
    "Atlas authentication module initialized."
  );
})();