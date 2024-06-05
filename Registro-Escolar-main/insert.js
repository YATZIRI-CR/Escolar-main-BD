import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
//import { getFirestore } from "./node_modules/firebase/firebase-firestore-lite.js";

import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCJJF3YkuFXoYFPxMf6115Tv5c2W2LYQ8M",
  authDomain: "prueba-eea61.firebaseapp.com",
  projectId: "prueba-eea61",
  storageBucket: "prueba-eea61.appspot.com",
  messagingSenderId: "944992827636",
  appId: "1:944992827636:web:87b546a959ef61cbf286a1",
  measurementId: "G-X2QBTHK0XE"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let bti = document.getElementById("inser");
let btc = document.getElementById("consu");

const tablaEstudiantes = document.querySelector("#tbEstudiantes");

bti.addEventListener('click', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("ap").value;
  const matricula = document.getElementById("mat").value;
  const carrera = document.getElementById("carr").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("cel").value;
  const estado = document.getElementById("est").value;

  if (!nombre || !apellidos || !matricula || !carrera || !correo || !telefono || !estado) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  try {
    const docRef = await setDoc(
      doc(db, "Estudiantes", matricula),
      {
        Nombre: nombre,
        Apellidos: apellidos,
        Matricula: matricula,
        Carrera: carrera,
        Correo: correo,
        Telefono: telefono,
        Estado: estado,
        Registro: "SAROCHITA",
      }
    );
    const overlayDiv = mostrarOverlay();
    const mensajeErrorHTML = `
      <div id="mensaje-completado" class="mensaje-completado">
        <p>Subiendo Registro...</p>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", mensajeErrorHTML);
    const mensajeError = document.getElementById("mensaje-completado");
    setTimeout(() => {
      mensajeError.remove();
      overlayDiv.remove();
    }, 3000);
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
  }
});

btc.addEventListener('click', async (e) => {
  ShowUsers();
  viewUsuarios2();
});

async function ShowUsers() {
  tbEstudiantes.innerHTML = "";
  const Allusers = await ViewUsuarios();
  Allusers.forEach((doc) => {
    const datos = doc.data();
    tbEstudiantes.innerHTML += `<tr class = "regis" data-id="${doc.id}">
    <td>${datos.Nombre}</td>
    <td>${datos.Apellidos}</td>
    <td>${datos.Telefono}</td>
    <td>${datos.Estado}</td>
    <td>
      <button class="btn-primary btn m-1 editar_" data-id="${doc.id}" >
        Editar 
      <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
      </button> 
      <button class="btn-danger btn eliminar_"  data-id="${doc.id}|${datos.Nombre}|${datos.Apellidos}" >
      Eliminar 
      <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
      
      </button>
    </td>
    </tr>`;
  });
}

async function ViewUsuarios() {
  const userRef = collection(db, "Estudiantes");
  const Allusers = await getDocs(userRef);
  return Allusers;
}

async function viewUsuarios2() {
  const q = query(collection(db, "Estudiantes"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const cities = [];
    querySnapshot.forEach((doc) => {
      cities.push(doc.data().nombre);
    });
    console.log("Current cities in CA: ", cities.join(", "));
  });
}

$("#tbEstudiantes").on("click", ".eliminar_", async function () {
  const producto_id = $(this).data("id");
  console.log("click en " + producto_id);
  let datox = producto_id.split('|');
  console.log("datos  " + datox[1]);
  try {
    await deleteDoc(doc(db, "Estudiantes", datox[0]));
  } catch (error) {
    console.log("error", error);
  }
});

$("#tbEstudiantes").on("click", ".editar_", async function () {
  const producto_id = $(this).data("id");
  console.log("click en editar" + producto_id);
  try {
    const washingtonRef = doc(db, "Estudiantes", producto_id.toString());
    await updateDoc(washingtonRef, {
      Nombre: document.getElementById("nombre").value,
      Apellidos: document.getElementById("ap").value,
      Carrera: document.getElementById("carr").value,
      Correo: document.getElementById("correo").value,
      Telefono: document.getElementById("cel").value,
      Estado: document.getElementById("est").value,
      Registro: "SAROCHITA",
    });
  } catch (error) {
    console.log("error", error);
  }
});

function mostrarOverlay() {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.position = "fixed";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.width = "100%";
  overlayDiv.style.height = "100%";
  overlayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
  overlayDiv.style.zIndex = "999";
  overlayDiv.id = "overlay-div";
  document.body.appendChild(overlayDiv);
  return overlayDiv;
}