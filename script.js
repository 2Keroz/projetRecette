// USER 
function createUser() {
  console.log("Fonction createUser bien appelée")
  let userData = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
  };

  fetch('http://127.0.0.1:3000/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Utilisateur créé:', data);
      // Ajoutez ici le code pour gérer la réponse (par exemple, afficher un message de succès)
  })
  .catch(error => {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      // Ajoutez ici le code pour gérer l'erreur
  });
}


// RECETTES 
function addRecette() {
  let recetteData = {
    title: document.getElementById('title').value,
    ingredients: document.getElementById('ingredients').value.split(','),
    instructions: document.getElementById('instructions').value,
    preparation_time: document.getElementById('preparation_time').value,
    cooking_time: document.getElementById('cooking_time').value,
    difficulty: document.getElementById('difficulty').value,
    category: document.getElementById('category').value
  };

  // Obtenir le token du localStorage
  const token = localStorage.getItem('authToken');

  fetch('http://127.0.0.1:3000/recettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("authToken")  // Ajouter le token dans les headers
    },
    body: JSON.stringify(recetteData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Erreur lors de l'ajout de la recette");
    }
  })
  .then(data => {
    console.log('Recette ajoutée:', data);
    getRecettes();  // Mettre à jour la liste des recettes
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    getRecettes();
});

function getRecettes() {

  const token = localStorage.getItem('authToken');
  if (!token) {
    console.log("Vous devez être connecté pour ajouter une recette");
    return;
  }
  const recettesContainer = document.getElementById('recettes-container');
  if (!recettesContainer) {
    console.error("L'élément #recettes-container n'existe pas");
    return;
  }

  // Réinitialiser le contenu du container
  recettesContainer.innerHTML = '<div id="recettes-list"></div>';

  let recettesList = document.getElementById('recettes-list');

  fetch('http://127.0.0.1:3000/recettes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(recette => {
        createRecette(recette);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des recettes:', error);
    });
}

function deleteRecette(id) {
  fetch("http://127.0.0.1:3000/recettes/id/" + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => {
    if (response.ok) {
      getRecettes();
    }
  });
}

function createRecette(recette) {
  const recetteElement = document.createElement('div');
  recetteElement.classList.add('recette-card');

  // Crée les éléments HTML pour chaque section de la recette
  recetteElement.innerHTML = `
      <h3>${recette.title}</h3>
      <p><strong>Ingrédients:</strong> ${recette.ingredients.join(', ')}</p>
      <p><strong>Instructions:</strong> ${recette.instructions}</p>
      <p><strong>Temps de préparation:</strong> ${recette.preparation_time} minutes</p>
      <p><strong>Temps de cuisson:</strong> ${recette.cooking_time} minutes</p>
      <p><strong>Difficulté:</strong> ${recette.difficulty}</p>
      <p><strong>Catégorie:</strong> ${recette.category}</p>
      <button onclick="deleteRecette('${recette._id}')">Supprimer</button>
      <button onclick="modifyRecette('${recette._id}', '${recette.title}', '${recette.ingredients.join(', ')}', '${recette.instructions}', '${recette.preparation_time}', '${recette.cooking_time}', '${recette.difficulty}', '${recette.category}')">Modifier</button>
  `;

  // Masque tous les <p> initialement
  const paragraphs = recetteElement.querySelectorAll('p');
  paragraphs.forEach(p => p.style.display = 'none');

  // Ajoute un événement de clic sur le titre pour afficher/masquer les <p>
  const titleElement = recetteElement.querySelector('h3');
  titleElement.style.cursor = 'pointer';  // Le curseur indique que le titre est cliquable
  titleElement.addEventListener('click', () => {
    paragraphs.forEach(p => {
      if (p.style.display === 'none') {
        p.style.display = 'block';  // Affiche tous les <p>
      } else {
        p.style.display = 'none';   // Masque tous les <p>
      }
    });
  });

  // Ajoute la recette au conteneur des recettes
  document.getElementById('recettes-list').appendChild(recetteElement);
}


function modifyRecette(id, title, ingredients, instructions, preparation_time, cooking_time, difficulty, category) {
  const recetteElement = document.createElement('div');
  recetteElement.classList.add('recette-card');

  recetteElement.innerHTML = `
    <h3>Modifier la recette</h3>
    <form id="editForm">
      <div>
        <label for="edit-title">Titre :</label>
        <input type="text" id="edit-title" value="${title}">
      </div>
      <div>
        <label for="edit-ingredients">Ingrédients :</label>
        <textarea id="edit-ingredients">${ingredients}</textarea>
      </div>
      <div>
        <label for="edit-instructions">Instructions :</label>
        <textarea id="edit-instructions">${instructions}</textarea>
      </div>
      <div>
        <label for="edit-preparation_time">Temps de préparation (en minutes) :</label>
        <input type="number" id="edit-preparation_time" value="${preparation_time}">
      </div>
      <div>
        <label for="edit-cooking_time">Temps de cuisson (en minutes) :</label>
        <input type="number" id="edit-cooking_time" value="${cooking_time}">
      </div>
      <div>
        <label for="edit-difficulty">Difficulté :</label>
        <select id="edit-difficulty">
          <option value="Facile" ${difficulty === 'Facile' ? 'selected' : ''}>Facile</option>
          <option value="Moyen" ${difficulty === 'Moyen' ? 'selected' : ''}>Moyen</option>
          <option value="Difficile" ${difficulty === 'Difficile' ? 'selected' : ''}>Difficile</option>
        </select>
      </div>
      <div>
        <label for="edit-category">Catégorie :</label>
        <select id="edit-category">
          <option value="entree" ${category === 'entree' ? 'selected' : ''}>Entrée</option>
          <option value="Plat" ${category === 'Plat' ? 'selected' : ''}>Plat</option>
          <option value="Dessert" ${category === 'Dessert' ? 'selected' : ''}>Dessert</option>
        </select>
      </div>
      <button type="button" onclick="submitModifiedRecette('${id}')">Enregistrer</button>
      <button type="button" onclick="getRecettes()">Annuler</button>
    </form>
  `;

  const recettesContainer = document.getElementById('recettes-container');
  if (recettesContainer) {
    recettesContainer.innerHTML = '';
    recettesContainer.appendChild(recetteElement);
  } else {
    console.error("L'élément #recettes-container n'existe pas");
  }
}

function submitModifiedRecette(id) {
  const updatedRecetteData = {
    title: document.getElementById('edit-title').value,
    ingredients: document.getElementById('edit-ingredients').value.split(','),
    instructions: document.getElementById('edit-instructions').value,
    preparation_time: document.getElementById('edit-preparation_time').value,
    cooking_time: document.getElementById('edit-cooking_time').value,
    difficulty: document.getElementById('edit-difficulty').value,
    category: document.getElementById('edit-category').value
  };

  fetch('http://127.0.0.1:3000/recettes/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRecetteData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          console.error('Erreur de l\'API:', data);
          throw data;
        });
      }
      return response.json();
    })
    .then(data => {
      const recettesContainer = document.getElementById('recettes-container');
      if (recettesContainer) {
        recettesContainer.innerHTML = '<div id="recettes-list"></div>';
        getRecettes();
      } else {
        console.error("L'élément #recettes-container n'existe pas");
      }
    })
    .catch(error => {
      console.error('Erreur lors de la modification de la recette:', error);
    });
}

// Fonction handleErrors à définir si elle n'existe pas déjà
function handleErrors(error) {
  console.error('Une erreur est survenue:', error);
  // Ajoutez ici la logique pour gérer les erreurs (par exemple, afficher un message à l'utilisateur)
}

// MODAL 
function openSignup() {
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Fermer la modal si l'utilisateur clique en dehors de la modal
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}


function openLogin() {
  document.getElementById('loginModal').style.display = 'block';
}

function loginUser() {
  let loginData = {
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value
  };


  fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.token) {
          // Stocker le token dans le localStorage
          localStorage.setItem('authToken', data.token);
          console.log('Connexion réussie:', data);
          closeLoginModal();
          updateButtons();
          getRecettes();
      } else {
          console.error('Erreur lors de la connexion:', data);
      }
  })
  .catch(error => {
      console.error("Erreur lors de la connexion:", error);
  });
}

function logoutUser() {
  localStorage.removeItem('authToken');
  document.getElementById('recettes-container').innerHTML = '';
  updateButtons()
}


function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

// Fermer la modal si l'utilisateur clique en dehors de la modal
window.onclick = function(event) {
  const loginModal = document.getElementById('loginModal');
  if (event.target === loginModal) {
      loginModal.style.display = 'none';
  }
}


function updateButtons() {
  const token = localStorage.getItem('authToken');
  if (token) {
    document.getElementById('logout-button').style.display = 'block';
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('signup-button').style.display = 'none';
  } else {
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('signup-button').style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', updateButtons);