// Crear objetos de tipo Usuario con datos ingresados por el usuario
let nombre = prompt("Ingrese su nombre:");
let apellido = prompt("Ingrese su apellido:");
let dni = prompt("Ingrese su dni:");
let mail = prompt("Ingrese su mail:");
let fechaN = prompt("Ingrese su fecha de nacimiento:");

// Estructura de creación del objeto
function usuarioObj(nombre, apellido, dni, mail, fechaN) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.mail = mail;
    this.fechaN = fechaN;
}

let usuarioUno = new usuarioObj(nombre, apellido, dni, mail, fechaN);

// Mostrar al usuario la información por la web de su registro
document.getElementById("output").innerHTML = `
    <div class="tablaDatos">
        <table>
            <tr>
                <th>Descripción</th>
                <th>Dato ingresado</th>
            </tr>
            <tr>
                <td>Nombre:</td>
                <td>${usuarioUno.nombre}</td>
            </tr>
            <tr>
                <td>Apellido:</td>
                <td>${usuarioUno.apellido}</td>
            </tr>
            <tr>
                <td>DNI:</td>
                <td>${usuarioUno.dni}</td>
            </tr>
            <tr>
                <td>Mail:</td>
                <td>${usuarioUno.mail}</td>
            </tr>
            <tr>
                <td>Fecha de Nacimiento:</td>
                <td>${usuarioUno.fechaN}</td>
            </tr>
        </table>
    </div>
`;

//======================================================================
// VARIABLES
//======================================================================
let miCanvas = document.querySelector('#pizarra');
let ctx = miCanvas.getContext("2d");
let lineas = [];
let pintarLinea = false;
let nuevaPosicionX = 0;
let nuevaPosicionY = 0;
let tamañoPincel = 10; // Tamaño del pincel por defecto
let colorPincel = '#000000'; // Color del pincel por defecto
let esGoma = false; // Variable para controlar si estamos en modo goma

miCanvas.width = 500;
miCanvas.height = 500;

//======================================================================
// FUNCIONES
//======================================================================

// Bloquear el scroll mientras se dibuja
function empezarDibujo(event) {
    pintarLinea = true;
    document.body.classList.add('no-scroll'); // Bloquear scroll
    nuevaPosicionX = obtenerCoordenadaX(event);
    nuevaPosicionY = obtenerCoordenadaY(event);

    // Si estamos en modo goma, cambiamos el modo de mezcla
    if (esGoma) {
        ctx.globalCompositeOperation = 'destination-out'; // Activar modo borrador
    } else {
        ctx.globalCompositeOperation = 'source-over'; // Modo de dibujo normal
    }
}

/**
 * Función que guarda la posición de la nueva línea
 */
function guardarLinea() {
    lineas.push({ puntos: [{ x: nuevaPosicionX, y: nuevaPosicionY }], tamaño: tamañoPincel, color: colorPincel });
}

/**
 * Función que dibuja la línea
 */
// Ajustes para líneas más suaves
function dibujarLinea(event) {
    if (pintarLinea) {
        let posX = obtenerCoordenadaX(event);
        let posY = obtenerCoordenadaY(event);

        ctx.lineWidth = tamañoPincel;
        ctx.strokeStyle = colorPincel;
        ctx.lineCap = 'round';  // Hacer que los bordes de las líneas sean redondeados
        ctx.lineJoin = 'round'; // Hacer que las esquinas de las líneas sean redondeadas

        ctx.beginPath();
        ctx.moveTo(nuevaPosicionX, nuevaPosicionY);
        ctx.lineTo(posX, posY);
        ctx.stroke();

        nuevaPosicionX = posX;
        nuevaPosicionY = posY;

        guardarLinea();
    }
}

/**
 * Función que termina de dibujar
 */
function terminarDibujo() {
    pintarLinea = false;
    document.body.classList.remove('no-scroll'); // Habilitar scroll
}


/**
 * Función que limpia el lienzo
 */
function limpiarLienzo() {
    ctx.clearRect(0, 0, miCanvas.width, miCanvas.height);
    lineas = [];
}

/**
 * Función que dibuja la línea guardada
 */
function dibujarLineasGuardadas() {
    lineas.forEach(linea => {
        ctx.lineWidth = linea.tamaño;
        ctx.strokeStyle = linea.color;
        ctx.globalCompositeOperation = 'source-over'; // Cambiar el modo de mezcla
        ctx.beginPath();
        linea.puntos.forEach((punto, index) => {
            if (index === 0) {
                ctx.moveTo(punto.x, punto.y);
            } else {
                ctx.lineTo(punto.x, punto.y);
            }
        });
        ctx.stroke();
    });
}

/**
 * Obtiene la coordenada X teniendo en cuenta el evento
 */
function obtenerCoordenadaX(event) {
    if (event.changedTouches) {
        return event.changedTouches[0].clientX - miCanvas.getBoundingClientRect().left;
    } else {
        return event.clientX - miCanvas.getBoundingClientRect().left;
    }
}

/**
 * Obtiene la coordenada Y teniendo en cuenta el evento
 */
function obtenerCoordenadaY(event) {
    if (event.changedTouches) {
        return event.changedTouches[0].clientY - miCanvas.getBoundingClientRect().top;
    } else {
        return event.clientY - miCanvas.getBoundingClientRect().top;
    }
}

// Función para guardar el lienzo como imagen PNG
function guardarImagen() {
    // Obtiene el lienzo y convierte el contenido a una URL de datos en formato PNG
    const dataURL = miCanvas.toDataURL('image/png');

    // Crea un enlace temporal para descargar la imagen
    const enlace = document.createElement('a');
    enlace.href = dataURL;
    enlace.download = 'mi-imagen.png'; // Nombre del archivo a guardar

    // Simula un clic en el enlace para iniciar la descarga
    enlace.click();
}

// Evento para el botón de guardar imagen
document.getElementById('saveImage').addEventListener('click', guardarImagen);


//======================================================================
// EVENTOS
//======================================================================

// Evento para el tamaño del pincel
document.getElementById('brushSize').addEventListener('input', function() {
    tamañoPincel = this.value;
    document.getElementById('brushSizeValue').textContent = tamañoPincel;
});

// Evento para el color del pincel
document.getElementById('colorPicker').addEventListener('change', function() {
    colorPincel = this.value;
});

// Evento para borrar el lienzo
document.getElementById('clearCanvas').addEventListener('click', limpiarLienzo);

// Evento para usar la goma
document.getElementById('useEraser').addEventListener('click', function() {
    esGoma = true; // Activar modo goma
    tamañoPincel = 30; // Tamaño de la goma
});

// Evento para usar el pincel
document.getElementById('useBrush').addEventListener('click', function() {
    esGoma = false; // Desactivar modo goma
    colorPincel = document.getElementById('colorPicker').value; // Restaurar el color del pincel
    tamañoPincel = document.getElementById('brushSize').value; // Restaurar el tamaño del pincel
});

// Eventos para dibujar en el lienzo
miCanvas.addEventListener('mousedown', empezarDibujo);
miCanvas.addEventListener('mousemove', dibujarLinea);
miCanvas.addEventListener('mouseup', terminarDibujo);
miCanvas.addEventListener('mouseout', terminarDibujo);

// Eventos para pantallas táctiles
miCanvas.addEventListener('touchstart', empezarDibujo);
miCanvas.addEventListener('touchmove', dibujarLinea);
miCanvas.addEventListener('touchend', terminarDibujo);
miCanvas.addEventListener('touchcancel', terminarDibujo);
