let errorInformation; // en rapport avec displayErrorMessage

if (location.pathname === '/login.html') {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();
    try {
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
      if (!response.ok) {
        throw new Error(`${response.status}`)
      }

      handleSuccessfulResponse(response)

    }
    catch (error) {
      const statusCode = parseInt(error.message)

      alertErrorLogin(statusCode)
      if (!errorInformation) {
        displayErrorMessage();
      }
    }

  }
  )
}

function alertErrorLogin(status) {
  switch (status) {
    case 401:
      console.error("Non autorisé (401).");
      alert("Erreur de connexion : Email ou mot de passe incorrect. Veuillez vérifier vos identifiants et réessayer.");
      break;
    case 404:
      console.error("Ressource non trouvée (404).");
      alert("Erreur de connexion : L'email saisi n'est pas associé à un compte. Veuillez vérifier votre adresse email ou créer un compte.");
      break;
    case 500:
      console.error("Erreur interne du serveur (500).");
      alert("Erreur de connexion : Une erreur est survenue sur nos serveurs. Veuillez réessayer plus tard.");
      break;
    default:
      console.error(`Erreur inattendue (${status}).`);
      alert("Erreur de connexion : Un problème inattendu est survenu. Veuillez réessayer plus tard.");
      break;
  }
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

  // Ajoute les classes d'erreur 
  email.classList.add("errorInput");
  password.classList.add("errorInput");
}


//***** récuprer l'id et le token de l'authent *****/
export function getStoredId() {
  return localStorage.getItem('userId');
}

export function getStoredToken() {
  return localStorage.getItem('token');
}
//***** Affiche le boutton de déconnexion */
export function displayLogout() {
  const loginLink = document.querySelector(".login-link");
  const logout = document.createElement("button");
  logout.innerHTML = "logout";
  const loginItem = document.querySelector(".login-item");
  loginItem.appendChild(logout);
  loginLink.remove();
  logout.classList.add("logout-btn");
  const logoutBtn = document.querySelector(".logout-btn");

  //***** se deconnecter et lance affichage */
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear()
      location.replace("http://127.0.0.1:5500/index.html?");
    })
  }
}





//S0phie