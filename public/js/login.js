const loginHandler = async (e) => {
  e.preventDefault();

  const userUsername = document.getElementById("inputUsername").value.trim();
  const userPassword = document.getElementById("inputPassword").value.trim();

  if (userPassword && userUsername) {
    const res = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ userUsername, userPassword }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      document.location.replace("/profile");
    } else {
    }
  }
};

const signupFormHandler = async (e) => {
  e.preventDefault();

  const userUsername = document.getElementById("signUpUsername").value.trim();
  const userPassword = document.getElementById("signUpPassword").value.trim();
  const firstName = document.getElementById("signUpFirst").value.trim();
  const lastName = document.getElementById("signUpLastName").value.trim();
  const bio = document.getElementById("signUpBio").value.trim();

  if (userUsername && userPassword) {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        userUsername,
        userPassword,
        firstName,
        lastName,
        bio,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      document.location.replace("/profile");
    } else {
      alert(res.statusText);
    }
  }
};

document
  .querySelector(".sign-up-form")
  .addEventListener("submit", signupFormHandler);

document.querySelector("#login-btn").addEventListener("click", loginHandler);
