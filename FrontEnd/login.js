let errorInformation; // en rapport avec loginReponse

if (window.location.pathname === '/login.html') {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    let credentials = {
      email: (document.getElementById("email").value),
      password: (document.getElementById("password").value),
    }

    const payload = JSON.stringify(credentials);


    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: payload,
    })

    loginResponse(response);

  })
}

async function loginResponse(response) {
  if ((response.status === 200) || (response.status === 304)) {
    handleSuccessfulResponse(response)
  } else {
    // Crée une seule fois le paragraphe d'erreur
    if (!errorInformation) {
      displayErrorMessage()
    }

  }
  // Ajoute les classes d'erreur 
  email.classList.add("errorInput");
  password.classList.add("errorInput");
}

async function handleSuccessfulResponse(response) {
  // Transforme la réponse en JSON
  const data = await response.json();
  const userId = data.userId;
  const token = data.token;

  // Sauvegarde l'authentification
  localStorage.setItem("userId", userId);
  localStorage.setItem("token", token);

  // Redirection
  location.replace("http://127.0.0.1:5500/index.html?");
}

function displayErrorMessage() {
  const loginBtn = document.getElementById("login-btn");
  errorInformation = document.createElement("p");
  errorInformation.textContent = "Votre adresse mail et/ou votre mot de passe n'est pas correct";
  loginBtn.insertAdjacentElement("beforebegin", errorInformation);
  errorInformation.style.paddingTop = "28px";
  errorInformation.style.color = "#993333"
}


//***** récuprer l'id et le token de l'authent *****/
export function getStoredId() {
  return localStorage.getItem('userId');
}

export function getStoredToken() {
  return localStorage.getItem('token');
}

//S0phie