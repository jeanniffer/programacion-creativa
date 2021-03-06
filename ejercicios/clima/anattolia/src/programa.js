import './scss/estilos.scss';
import lluvia from './assets/manuelh_lluvia.jpeg';
import dispersas from './assets/lm_scattered.jpeg';
import over from './assets/daniel_rodr_over.jpeg';
import despejado from './assets/mh_clear.jpeg';
import neblina from './assets/olgaluciahurtado_mist.jpeg';
import niebla from './assets/fog_miguel_angel_rojas.jpeg';
import rotas from './assets/lm_broken.jpeg';
import pocas from './assets/lm_few.jpeg';
import nieve from './assets/mh_nieve.jpg';
import trueno from './assets/mh_trueno.jpeg';
import haze from './assets/mh_haze.jpeg';
import sleet from './assets/miguelar_sleet.jpeg';

const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');

const lienzo2 = document.createElement('canvas');
const ctx2 = lienzo2.getContext('2d');

//API Key de Open Weather
const apiKey = 'b1c43b2e69342ccea61cc5aea15c82c8';
const img = new Image();

let datosImagen;
let datosImagen2;
let pixeles = [];
let clima;
let lat;
let lon;
let creditos = document.getElementById('creditos');
let imgTransformada = false;
let estadoImg = 1;

let p1 = '';
let p2 = '';
let fuente = [];
let colorTxt = [];

function actualizar() {
  lienzo.width = lienzo2.width = window.innerWidth;
  lienzo.height = lienzo2.height = window.innerHeight;

  ctx.fillStyle = 'rgba(255, 255, 255)';
  dibujar();
}

/* Imprimir las coordenadas en la pantalla */
function imprimirCoor([r, g, b]) {
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
  ctx.font = `${lienzo.width / 75}px Monospace`;
  ctx.fillText(lat + ', ' + lon, lienzo.width / 30, lienzo.height / 15);
  //console.log(r, g, b);
}

/* Imprimir el texto en la pantalla */
function imprimirTxt([posX, posY, tFuente, r, g, b], p1 = '', p2 = '') {
  const posH = lienzo.width / posX;
  const posV = lienzo.height / posY;
  ctx.font = `${lienzo.width / tFuente}px Monospace`;
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
  ctx.fillText(p1, posH, posV);
  ctx.fillText(p2, posH, posV + ctx.font[0] * 7);
}

/* Pintar la imagen en la pantalla */
function pintar(datos) {
  img.src = datos.img;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    imprimirCoor(datos.color);
    imprimirTxt(datos.fuente, datos.p1, datos.p2);
    creditos.innerHTML = datos.creditos;
    document.body.style.backgroundColor = datos.fondo;
    datosImagen = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
    ctx2.putImageData(datosImagen, 0, 0);

    pixeles = datosImagen.data;
    p1 = datos.p1;
    p2 = datos.p2;
    fuente = datos.fuente;
    colorTxt = datos.color;
  };
}

/* Elegir la imagen que se mostrará según el clima en las coordenadas del usuario */
function dibujar() {
  //Obtener las coordenadas del usuario
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //con las coordenadas, obtener el clima
    obtenerClima();
  });

  async function obtenerClima() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    //const url = `https://api.openweathermap.org/data/2.5/weather?lat=4&lon=73&appid=${apiKey}`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    clima = datos.weather[0].description;
    console.log(clima);
    if (clima.includes('clear')) {
      pintar({
        img: despejado,
        fuente: [30, 1.5, 18, 20, 20, 20],
        p1: 'Transparentes los aires,',
        p2: 'transparentes',
        color: [0, 0, 0],
        creditos: '"Aeropuerto El Dorado y sus alrededores", Manuel H',
        fondo: 'rgba(10,10,10)',
      });
    } else if (clima.includes('broken clouds') || clima.includes('smoke')) {
      pintar({
        img: rotas,
        fuente: [30, 1.5, 29, 250, 250, 250],
        p1: 'El temporal fue unánime',
        p2: 'y aborrecible a las miradas fue el mundo.',
        color: [50, 50, 50],
        creditos: '"Bomberos apagando un incendio", Leo Matiz',
        fondo: 'rgba(10,10,10)',
      });
    } else if (clima.includes('scattered clouds')) {
      pintar({
        img: dispersas,
        fuente: [30, 2, 30, 250, 250, 250],
        p1: 'La numerosa nube que se deshace en el poniente',
        p2: 'es nuestra imagen.',
        color: [70, 70, 70],
        creditos: 'Foto: Leo Matiz',
        fondo: 'rgba(10,10,10)',
      });
    } else if (clima.includes('overcast clouds')) {
      pintar({
        img: over,
        fuente: [30, 1.6, 30, 25, 25, 25],
        p1: 'No habrá una sola cosa que no sea una nube.',
        p2: '',
        color: [70, 70, 70],
        creditos: '"La primera chispa del bogotazo 1948 II", Daniel Rodríguez',
        fondo: 'rgba(10,10,10)',
      });
    } else if (clima.includes('few clouds')) {
      pintar({
        img: pocas,
        fuente: [30, 1.6, 30, 220, 220, 220],
        p1: 'Hay soledad en el hogar sin bulla.',
        p2: '',
        color: [220, 220, 220],
        creditos: 'Foto: Leo Matiz',
        fondo: 'rgba(0, 0, 0)',
      });
    } else if (clima.includes('rain') || clima.includes('drizzle')) {
      pintar({
        img: lluvia,
        fuente: [30, 2.3, 25, 25, 25, 25],
        p1: 'Quiero volver a tierras niñas;',
        p2: 'llévenme a un blando país de aguas.',
        color: [210, 210, 210],
        creditos: '"Carro de Bomberos en la Av. Jiménez por las Lluvias", Leo Matiz',
        fondo: 'rgba(220, 223, 228)',
      });
    } else if (clima.includes('mist')) {
      pintar({
        img: neblina,
        fuente: [30, 2.3, 35, 15, 15, 15],
        p1: 'Esta penumbra es lenta y no duele;',
        p2: 'fluye por un manso declive y se parece a la eternidad.',
        color: [25, 25, 25],
        creditos: '"Evanescente 5", Olga Lucía Hurtado',
        fondo: 'rgba(10, 13, 18)',
      });
    } else if (clima.includes('fog') || clima.includes('tornado')) {
      pintar({
        img: niebla,
        fuente: [30, 1.7, 28, 255, 255, 255],
        p1: 'Verano, ya me voy. Y me dan pena',
        p2: 'las manitas sumisas de tus tardes.',
        color: [255, 250, 250],
        creditos: '"Fanny (Serie Faenza)", Miguel Angel Rojas',
        fondo: 'rgba(230, 230, 230)',
      });
    } else if (clima.includes('snow') || clima.includes('sand')) {
      pintar({
        img: nieve,
        fuente: [30, 1.7, 28, 15, 15, 15],
        p1: 'en esta hora fría, en que la tierra',
        p2: 'trasciende a polvo humano y es tan triste',
        color: [15, 15, 15],
        creditos: 'Foto: Manuel H',
        fondo: 'rgba(20, 20, 20)',
      });
    } else if (clima.includes('thundersorm') || clima.includes('ash')) {
      pintar({
        img: trueno,
        fuente: [30, 1.5, 28, 255, 255, 255],
        p1: 'las alas no se me ven, los oídos me retumban',
        p2: '',
        color: [220, 220, 220],
        creditos: 'Foto: Manuel H',
        fondo: 'rgba(20, 20, 20)',
      });
    } else if (clima.includes('haze')) {
      pintar({
        img: haze,
        fuente: [30, 1.8, 30, 15, 15, 15],
        p1: 'tiene un día cualquiera mayor aire en sus alas',
        p2: '',
        color: [25, 25, 25],
        creditos: 'Foto: Manuel H',
        fondo: 'rgba(250, 250, 250)',
      });
    } else if (clima.includes('sleet') || clima.includes('squalls')) {
      pintar({
        img: sleet,
        fuente: [30, 1.8, 30, 15, 15, 15],
        p1: 'borrar lo poco hecho, empezar de la nada',
        p2: '',
        color: [25, 25, 25],
        creditos: '"Titanic (Serie Faenza)", Miguel Ángel Rojas',
        fondo: 'rgba(250, 250, 250)',
      });
    } else {
      ctx.fillText(clima, 100, 200);
    }
  }
}

/* Cambiar los colores de la imagen al hacer click */
lienzo.onclick = () => {
  //datosImagen2 = ctx2.getImageData(0, 0, window.innerWidth, window.innerHeight);

  /* Comprueba si hay datos en pixeles[] */
  if (pixeles.length) {
    /* Comprueba si la imagen mostrada es la original */
    if (estadoImg === 1) {
      document.body.style.backgroundColor = 'rgba(0, 0, 0)';
      /* Comprueba si los datos de pixeles[] no se han transformado. 
      Esto es útil para hacer las operaciones sobre cada pixel una sola vez y 
      ahorrar recursos. */
      if (!imgTransformada) {
        for (let i = 0; i < pixeles.length; i += 4) {
          pixeles[i + 1] = pixeles[200];
          pixeles[i + 2] = pixeles[i + 3];
        }
        imgTransformada = true;
      }
      /* Pinta la imagen transformada */
      ctx.putImageData(datosImagen, 0, 0);
      estadoImg = 0;
    } else if (estadoImg === 0) {
      /* Pinta la imagen original y vuelve a imprimir los textos */
      ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      imprimirCoor(colorTxt);
      imprimirTxt(fuente, p1, p2);
      estadoImg = 1;
    }
  }
};

window.onresize = actualizar;

dibujar();
actualizar();
