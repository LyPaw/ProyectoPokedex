const URL_POKEMON = "https://pokeapi.co/api/v2/pokemon";

const formulario = document.querySelector("#formulario-busqueda");
const campoNombre = document.querySelector("#nombre-pokemon");
const estadoBusqueda = document.querySelector("#estado-busqueda");
const listadoPokemon = document.querySelector("#listado-pokemon");

if (
  formulario === null ||
  campoNombre === null ||
  estadoBusqueda === null ||
  listadoPokemon === null
) {
  throw new Error("Falta un elemento necesario en index.html");
}

async function obtenerDatos(url) {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`);
  }

  return respuesta.json();
}

async function cargarListado() {
  estadoBusqueda.textContent = "Cargando Pokémon…";

  try {
    const datos = await obtenerDatos(`${URL_POKEMON}?limit=20`);
    listadoPokemon.replaceChildren();

    for (const pokemon of datos.results) {
      const partesUrl = pokemon.url.split("/");
      const numero = partesUrl[partesUrl.length - 2];

      const tarjeta = document.createElement("article");
      tarjeta.classList.add("tarjeta");

      const numeroPokemon = document.createElement("span");
      numeroPokemon.textContent = `#${numero}`;

      const imagen = document.createElement("img");
      imagen.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numero}.png`;
      imagen.alt = pokemon.name;
      imagen.loading = "lazy";

      const nombrePokemon = document.createElement("h3");
      nombrePokemon.textContent = pokemon.name;

      const botonFicha = document.createElement("button");
      botonFicha.type = "button";
      botonFicha.textContent = "Ficha completa";
      botonFicha.setAttribute("data-nombre", pokemon.name);

      tarjeta.append(numeroPokemon, imagen, nombrePokemon, botonFicha);
      listadoPokemon.append(tarjeta);
    }

    estadoBusqueda.textContent = "Se han cargado los Pokémon.";
  } catch (error) {
    console.error("No se pudo cargar el listado:", error);
    estadoBusqueda.textContent = "No se ha podido cargar el listado. Comprueba tu conexión.";
  }
}

listadoPokemon.addEventListener("click", evento => {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const boton = evento.target.closest("button[data-nombre]");

  if (boton !== null) {
    const nombre = boton.getAttribute("data-nombre");
    window.location.href = `ficha.html?pokemon=${encodeURIComponent(nombre)}`;
  }
});

formulario.addEventListener("submit", async evento => {
  evento.preventDefault();

  const nombre = campoNombre.value.trim().toLowerCase();

  if (nombre === "") {
    estadoBusqueda.textContent = "Escribe el nombre o el número de un Pokémon.";
    return;
  }

  estadoBusqueda.textContent = "Buscando…";

  try {
    const pokemon = await obtenerDatos(`${URL_POKEMON}/${encodeURIComponent(nombre)}`);
    window.location.href = `ficha.html?pokemon=${encodeURIComponent(pokemon.name)}`;
  } catch (error) {
    console.error("No se pudo realizar la búsqueda:", error);

    if (error.message === "Error HTTP: 404") {
      estadoBusqueda.textContent = "No se ha encontrado ese Pokémon.";
    } else {
      estadoBusqueda.textContent = "No se ha podido realizar la búsqueda. Comprueba tu conexión.";
    }
  }
});

cargarListado();