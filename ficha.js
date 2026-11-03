const URL_POKEMON = "https://pokeapi.co/api/v2/pokemon";

const estadoFicha = document.querySelector("#estado-ficha");
const fichaPokemon = document.querySelector("#ficha-pokemon");

if (estadoFicha === null || fichaPokemon === null) {
  throw new Error("Falta un elemento necesario en ficha.html");
}

const parametros = new URLSearchParams(window.location.search);
const nombre = parametros.get("pokemon");

async function obtenerDatos(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`);
  }

  return respuesta.json();
}

function crearFila(etiqueta, valor) {
  const fila = document.createElement("div");

  const textoEtiqueta = document.createElement("span");
  textoEtiqueta.textContent = etiqueta;

  const textoValor = document.createElement("strong");
  textoValor.textContent = valor;

  fila.append(textoEtiqueta, textoValor);
  return fila;
}

function mostrarFicha(pokemon) {
  const articulo = document.createElement("article");
  articulo.classList.add("ficha");

  const numero = document.createElement("span");
  numero.textContent = `#${pokemon.id}`;

  const titulo = document.createElement("h2");
  titulo.textContent = pokemon.name;

  const cabecera = document.createElement("header");
  cabecera.append(numero, titulo);

  const imagen = document.createElement("img");
  imagen.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  imagen.alt = pokemon.name;

  const tipos = pokemon.types.map(tipo => tipo.type.name).join(", ");
  const habilidades = pokemon.abilities.map(habilidad => habilidad.ability.name).join(", ");

  const tituloEstadisticas = document.createElement("h3");
  tituloEstadisticas.textContent = "Estadísticas base";

  articulo.append(
    cabecera,
    imagen,
    crearFila("Tipo", tipos),
    crearFila("Altura", `${pokemon.height / 10} M`),
    crearFila("Peso", `${pokemon.weight / 10} Kg`),
    crearFila("Habilidades", habilidades),
    tituloEstadisticas
  );

  for (const estadistica of pokemon.stats) {
    articulo.append(crearFila(estadistica.stat.name, estadistica.base_stat));
  }

  fichaPokemon.replaceChildren(articulo);
}

async function cargarFicha() {
  if (!nombre) {
    estadoFicha.textContent = "No se ha indicado ningún Pokémon.";
    return;
  }

  estadoFicha.textContent = "Cargando Pokémon…";

  try {
    const pokemon = await obtenerDatos(`${URL_POKEMON}/${encodeURIComponent(nombre)}`);
    mostrarFicha(pokemon);
    estadoFicha.textContent = "";
  } catch (error) {
    console.error("No se pudo cargar la ficha:", error);

    if (error.message === "Error HTTP: 404") {
      estadoFicha.textContent = "No se ha encontrado ese Pokémon.";
    } else {
      estadoFicha.textContent = "No se ha podido cargar la ficha. Comprueba tu conexión.";
    }
  }
}

cargarFicha();