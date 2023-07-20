const limitRetry = 3;
let CreditoSeleccionado = "";
const credits = [
  {
    nombre: "creditSilver",
    montoMinimo: 600000,
    montoMaximo: 1000000,
    edadMinima: 18,
    edadMaxima: 70,
    interes: 0.10, 
  },
  {
    nombre: "creditGold",
    montoMinimo: 1000000,
    montoMaximo: 7000000,
    edadMinima: 25,
    edadMaxima: 65,
    interes: 0.25,
  },
  {
    nombre: "creditBlack",
    montoMinimo: 3000000,
    montoMaximo: 70000000,
    edadMinima: 28,
    edadMaxima: 60,
    interes: 0.22,
  },
];

// for (let i = 0; i < credits.length; i++) {
//   console.log(credits[i]);
// }

function iniciarProceso() {
  alert("Bienvenid@ a MoneyExpress");
  const NombreUsuario = prompt("Ingrese su Nombre completo, por favor.");
  if (NombreUsuario == null || NombreUsuario == "") {
    const reintentar = confirm(
      "Nombre Invalido \n ¿desea intentalo nuevamente?"
    );
    if (reintentar) {
      iniciarProceso();
    } else {
      return;
    }
  }
  const msgVienvenida = `
    Hola ${NombreUsuario} Bienvenido
    ¿Deseas Comenzar la Solicitud ? 
  `;
  const SeguirCredito = confirm(msgVienvenida);
  if (SeguirCredito) {
    seleccionarCredito();
    PrestamoJunior(NombreUsuario);
  }
}

const seleccionarCredito = () => {
  // const opciones = credits.map((credito, index) => `${index + 1}. ${credito.nombre}`);
  const opciones = credits.map((credito, index) => {
    const { nombre, montoMinimo, montoMaximo, edadMinima, edadMaxima, interes} = credito;
    const montoMinimoFormateado = fMoney(montoMinimo);
    const montoMaximoFormateado = fMoney(montoMaximo);
    return `${index + 1} ${nombre}: Monto: ${montoMinimoFormateado} - ${montoMaximoFormateado}, Edad:${edadMinima} - ${edadMaxima}, Interes: ${interes}`;
  });

  const eleccion = parseInt(prompt(`Seleccione un tipo de crédito:\n${opciones.join("\n")}`));

  if (isNaN(eleccion) || eleccion < 1 || eleccion > credits.length) {
    alert("Opción inválida. Por favor, seleccione una opción válida.");
    iniciarProceso();
    return;
  
  }


  const creditoSeleccionado = credits[eleccion - 1];
  CreditoSeleccionado = creditoSeleccionado.nombre;
  alert(`Ha seleccionado el crédito ${creditoSeleccionado.nombre}`);
};

function PrestamoJunior(usuario) {
  const validEdad = validacionDeEdad();
  if (validEdad) {
    alert("Se ha excedido el número máximo de intentos. La solicitud se cancela.");
    return;
  }
  const monto = validarMonto();
  if (!monto) {
    return;
  }
  const cuotas = validarCuotas();
  if (!cuotas) {
    return;
  }
  calcularResultado(usuario, monto, cuotas);
}

function validacionDeEdad() {
  const creditoSeleccionado = credits.find((credito) => credito.nombre === CreditoSeleccionado);

  let intentos = 1;
  let edad = 0;
  while (intentos <= limitRetry) {
    edad = parseInt(prompt("Ingrese su edad:"));

    if (isNaN(edad)) {
      const msg = `Intento #${intentos} de ${limitRetry}\nEdad inválida.`;
      alert(msg);
    } else if (edad < creditoSeleccionado.edadMinima || edad > creditoSeleccionado.edadMaxima) {
      const msg = `Intento #${intentos} de ${limitRetry}\nDebe tener entre ${creditoSeleccionado.edadMinima} y ${creditoSeleccionado.edadMaxima} años para solicitar el crédito.`;
      alert(msg);
    } else {
      break;
    }

    intentos++;
    alert("Debe cumplir con el rango de edad para realizar la solicitud.");
  }

  return intentos > limitRetry;
}


function validarMonto() {
  const creditoSeleccionado = credits.find((credito) => credito.nombre === CreditoSeleccionado);
  const rangeMonto = `${fMoney(creditoSeleccionado.montoMinimo)} -/- ${fMoney(creditoSeleccionado.montoMaximo)}`;
  let monto = parseInt(prompt(`Ingrese el monto a Solicitar (${rangeMonto}):`));
  if (monto > creditoSeleccionado.montoMaximo || monto < creditoSeleccionado.montoMinimo) {
    alert(`Monto inválido. Debe ingresar un monto dentro del rango establecido (${rangeMonto}).`);
    monto = parseInt(prompt("Por favor ingresa nuevamente un monto valido:"));
  }
  if (isNaN(monto) || monto > creditoSeleccionado.montoMaximo || monto < creditoSeleccionado.montoMinimo) {
    alert("Monto invalido, Solicitud cancelada.");
    return null;
  }
  return monto;
}

function validarCuotas() {
  const msgCuotas = `
    Seleccione el plazo del préstamo:
      #[1] 3 meses
      #[2] 6 meses
      #[3] 9 meses
      #[4] 12 meses
  `;
  let nroCouta = parseInt(prompt(msgCuotas));
  if (isNaN(nroCouta) || nroCouta > 4 || nroCouta < 1) {
    alert("Número de cuotas no válido. Por favor, seleccione un número de cuotas válido.");
    nroCouta = parseInt(prompt(msgCuotas));
  }

  if (isNaN(nroCouta) || nroCouta > 4 || nroCouta < 1) {
    alert("Solicitud cancelada. Ha excedido el número de intentos válidos. Por favor, vuelva a intentar solicitar el crédito.");
    return null;
  }
  return nroCouta * 3;
}

function calcularResultado(usuario, monto, cuotas) {
  const creditoSeleccionado = credits.find((credito) => credito.nombre === CreditoSeleccionado);
  const MontoConInteres = monto * creditoSeleccionado.interes;
  const MontoTotal = MontoConInteres + monto;
  const valorCuota = MontoTotal / cuotas;
  const msg = `
      NOMBRE DEL CRÉDITO: ${creditoSeleccionado.nombre}
      USUARIO: ${usuario}
      DEUDA TOTAL: ${fMoney(MontoTotal)}
      INTERÉS: ${creditoSeleccionado.interes * 100}% ANUAL
      CANTIDAD DE CUOTAS: ${cuotas}
      VALOR DE CUOTA: ${fMoney(valorCuota)}
  `;
  alert(msg);
}

function fMoney(value) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

iniciarProceso();
