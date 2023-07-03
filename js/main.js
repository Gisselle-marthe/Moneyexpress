const nameCretid = "Credito Junior";
const interes = 0.20;
const edadMinima = 18;
const edadMaxima = 50;
const valorMaximo = 3000000;
const valorMinimo = 600000;
const limitRetry = 3;

function iniciarProceso() {
  alert("Bienvenid@ a MoneyExpress")
  const NombreUsuario = prompt("Ingrese su Nombre completo, por favor.")
  if (NombreUsuario == null || NombreUsuario == '') {
    const reintentar = confirm("Nombre Invalido \n ¿desea intentalo nuevamente?")
    if (reintentar) {
      iniciarProceso()
    } else {
      return
    }
  }
  const msgVienvenida = `
    Hola ${NombreUsuario} Bienvenido
    ¿Deseas Comenzar la Solicitud de: ${nameCretid}? 
  `
  const SeguirCredito = confirm(msgVienvenida)
  if (SeguirCredito) {
    PrestamoJunior(NombreUsuario)
  }
}

function PrestamoJunior(usuario) {
  const validEdad = validacionDeEdad()
  if (validEdad) {
    alert("Se ha excedido el número máximo de intentos. La solicitud se cancela.");
    return
  }
  const monto = validarMonto()
  if (!monto) {
    return
  }
  const cuotas = validarCuotas()
  if (!cuotas) {
    return
  }
  calcularResultado(usuario, monto, cuotas)
}

function validacionDeEdad() {
  let intentos = 1
  let edad = 0;
  while (intentos <= limitRetry) {
    edad = parseInt(prompt("Ingrese su edad:"));
    // Validar si la entrada es un número
    if (isNaN(edad)) {
      const msg = `intento #${intentos} de ${limitRetry} 
        Edad Invalida.`
      alert(msg);
    } else {
      if (edad >= edadMinima || edad <= edadMaxima) {
        break
      }
    }
    intentos++;
    alert("Debe ser mayor de edad para realizar la solicitud.");
  }
  return intentos > limitRetry;
}

function validarMonto() {
  const rangeMonto = `${fMoney(valorMinimo)} -/- ${fMoney(valorMaximo)}`
  let monto = parseInt(prompt(`Ingrese el monto a Solicitar (${rangeMonto}):`));
  if (monto > valorMaximo || monto < valorMinimo) {
    alert(`Monto inválido. Debe ingresar un monto dentro del rango establecido (${rangeMonto}).`);
    monto = parseInt(prompt("Por favor ingresa nuevamente un monto valido:"));
  }
  if (!isNaN(monto) && monto > valorMaximo || monto < valorMinimo) {
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
  `
  let nroCouta = parseInt(prompt(msgCuotas));
  if (!isNaN(nroCouta) && nroCouta > 4 || nroCouta < 1) {
    alert(`El Numero de cuotas no es valido para el Credito ${nameCretid}.
    Por favor Seleccione un Numero de Cuotas valido`);
    nroCouta = parseInt(prompt(msgCuotas));
  }

  if (!isNaN(nroCouta) && nroCouta > 4 || nroCouta < 1) {
    alert("Solicitud cancelada excedio el numero de intentos validos. \nPor favor Vuelva intentar solicitar el credito");
    return null;
  }
  return nroCouta * 3;
}

function calcularResultado(usuario, monto, cuotas) {
  const MontoConInteres = monto * interes
  const MontoTotal = MontoConInteres + monto
  const valorCuota = MontoTotal / cuotas
  const msg = `
      NOMBRE DEL CREDITO: ${nameCretid} 
      USUARIO: ${usuario} 
      DEUDA TOTAL: ${fMoney(MontoTotal)}
      INTERES: ${interes * 100}% ANUAL 
      CANTIDAD DE CUOTAS: ${cuotas}
      VALOR DE CUOTA: ${fMoney(valorCuota)}
  `
  alert(msg)
}

function fMoney(value) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}