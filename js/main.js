const limitRetry = 3;
let CreditoSeleccionado = "";
const credits = [
  {
    nombre: "Silver",
    montoMinimo: 600000,
    montoMaximo: 1000000,
    edadMinima: 18,
    edadMaxima: 70,
    interes: 0.20,
  },
  {
    nombre: "Gold",
    montoMinimo: 1000000,
    montoMaximo: 7000000,
    edadMinima: 25,
    edadMaxima: 65,
    interes: 0.25,
  },
  {
    nombre: "Black",
    montoMinimo: 3000000,
    montoMaximo: 70000000,
    edadMinima: 28,
    edadMaxima: 60,
    interes: 0.22,
  },
  
];
const cuotasMapping = [3, 6, 9, 12];

let selectedCredit = null;

const PintarCreditos = () => {
  const card_container = document.getElementById("card_container");
  console.log(card_container);
  credits.forEach((credit, index) => {
    const div = document.createElement("div");
    div.className = "col card_credits";
    div.innerHTML = `
      <i class="fas fa-rocket"></i>
      <h3>${credit.nombre}</h3>
      <p > ${fMoney(credit.montoMinimo)} - ${fMoney(credit.montoMaximo)} </p>
      <h5>Requisitos</h5>
      <p> Edad: ${credit.edadMinima} - ${credit.edadMaxima} </p>
      <p> Interes: ${credit.interes}</p>
    `;
    div.addEventListener("click", () => elegirCredito(index));
    card_container.appendChild(div);
  });
};

PintarCreditos();

const elegirCredito = (index) => {
  console.log(`Crédito seleccionado: ${index}`);
  selectedCredit = credits[index];

 
  const cards = document.querySelectorAll(".card_credits");

 
  cards.forEach(card => {
    card.classList.remove("selected");
  });

  // Agregar la clase "selected" solo a la card seleccionada
  cards[index].classList.add("selected");
};
const getUserData = () => {
  const names = document.getElementById("names").value;
  const edad = parseInt(document.getElementById("edad").value);
  const monto = parseInt(document.getElementById("monto").value);
  const email = document.getElementById("email").value;
  const cuotasOption = parseInt(document.getElementById("cuotas").value);
  const cuotas = cuotasMapping[cuotasOption - 1];

  if (selectedCredit) {
    if (edad < selectedCredit.edadMinima || edad > selectedCredit.edadMaxima) {
      
      console.log(
        "La edad no cumple con los requisitos del crédito seleccionado."
      );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La edad no cumple con los requisitos del crédito seleccionado.'
      });
      return;
    }

    if (
      monto < selectedCredit.montoMinimo ||
      monto > selectedCredit.montoMaximo
    ) {
      console.log(
        "El monto no cumple con los requisitos del crédito seleccionado."
      );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El monto no cumple con los requisitos del crédito seleccionado.'
      });
      return;
    }

    const montoTotal = monto + (monto * selectedCredit.interes) ;
    const montoCuota = montoTotal / cuotas;

    const info = `
      Solicitud de crédito válida para: ${names}
      Crédito seleccionado: ${selectedCredit.nombre}
      Monto total:${fMoney(montoTotal)}
      Número de cuotas: ${cuotas}
      Monto de cada cuota:${fMoney(montoCuota)}
    `;
    localStorage.setItem('creditInfo', JSON.stringify(info));
    Swal.fire(
      'Solicitud de crédito válida',
      info,
      'success'
    );

    console.log(info); // Aquí es donde necesitas imprimir la variable 'info'
  } else {
    console.log("No se ha seleccionado ningún crédito.");
  }
};

// Agregar un controlador de eventos al botón
document.getElementById("submit").addEventListener("click", getUserData);

// Llamar a la función para obtener los datos del usuario
getUserData();

function fMoney(value) {
    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  }