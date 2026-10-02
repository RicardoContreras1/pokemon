import { useEffect, useState } from 'react'
import './App.css'
import { Card, Modal, Button } from 'react-bootstrap'

function App() {

  // ==========================================
  // ESTADOS
  // ==========================================

  const [pokemons, setPokemons] = useState([])
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)


  // ==========================================
  // COLORES DE LOS TIPOS
  // ==========================================

  const coloresTipo = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  }


  // ==========================================
  // OBTENER POKÉMON
  // ==========================================

  const buscarPokemons = async () => {

    try {

      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20'
      )

      const data = await response.json()

      const detalles = await Promise.all(

        data.results.map(async (pokemon) => {

          const response = await fetch(pokemon.url)

          return await response.json()

        })

      )

      setPokemons(detalles)

    } catch (error) {

      console.error(
        'Error al obtener los Pokémon:',
        error
      )

    }

  }


  // ==========================================
  // CARGAR POKÉMON AL INICIAR
  // ==========================================

  useEffect(() => {

    buscarPokemons()

  }, [])


  // ==========================================
  // SELECCIONAR POKÉMON
  // ==========================================

  const seleccionarPokemon = (pokemon) => {

    setPokemonSeleccionado(pokemon)

    setMostrarModal(true)


    // Tipo principal

    const tipoPrincipal =
      pokemon.types[0].type.name


    const colorPrincipal =
      coloresTipo[tipoPrincipal]


    // Color secundario

    let colorSecundario =
      colorPrincipal


    // Si tiene dos tipos

    if (pokemon.types.length > 1) {

      const segundoTipo =
        pokemon.types[1].type.name

      colorSecundario =
        coloresTipo[segundoTipo]

    }


    // Pasar colores al CSS

    document.documentElement.style.setProperty(
      '--poke-principal',
      colorPrincipal
    )

    document.documentElement.style.setProperty(
      '--poke-secundario',
      colorSecundario
    )

  }


  // ==========================================
  // CERRAR MODAL
  // ==========================================

  const cerrarModal = () => {

    setMostrarModal(false)

    setPokemonSeleccionado(null)


    // Volver a colores Poké Ball

    document.documentElement.style.setProperty(
      '--poke-principal',
      '#e3350d'
    )

    document.documentElement.style.setProperty(
      '--poke-secundario',
      '#ffffff'
    )

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="contenedor-pokedex">


      {/* =====================================
          TÍTULO
      ===================================== */}

      <h1 className="titulo-pokedex">
        POKÉDEX
      </h1>


      {/* =====================================
          LÍNEA POKÉ BALL
      ===================================== */}

      <div className="pokeball-linea">

        <div className="pokeball-centro"></div>

      </div>


      {/* =====================================
          GRID
      ===================================== */}

      <div className="pokemon-grid">

        {pokemons.map((pokemon) => (

          <div
            key={pokemon.id}
            className="pokemon-item"
            onClick={() =>
              seleccionarPokemon(pokemon)
            }
          >

            <img
              src={
                pokemon.sprites?.other?.[
                  'official-artwork'
                ]?.front_default
              }
              alt={pokemon.name}
              className="pokemon-mini-img"
            />


            <span className="pokemon-number">
              #{pokemon.id}
            </span>


            <span className="pokemon-name">
              {pokemon.name.toUpperCase()}
            </span>

          </div>

        ))}

      </div>


      {/* =====================================
          MODAL
      ===================================== */}

      <Modal
        show={mostrarModal}
        onHide={cerrarModal}
        centered
        className="modal-pokedex"
      >

        <Modal.Body className="modal-pokemon">

          {pokemonSeleccionado && (

            <Card className="pokemon-card">


              {/* =================================
                  PARTE SUPERIOR
              ================================= */}

              <div className="card-top">

                <span className="poke-id">

                  #{pokemonSeleccionado.id}

                </span>


                <span className="poke-hp">

                  HP {
                    pokemonSeleccionado.stats[0]
                      .base_stat
                  }

                </span>

              </div>


              {/* =================================
                  IMAGEN
              ================================= */}

              <div className="img-wrapper">

                <div className="circulo-imagen">

                  <Card.Img
                    className="pokemon-img"
                    src={
                      pokemonSeleccionado
                        .sprites
                        ?.other
                        ?.['official-artwork']
                        ?.front_default
                    }
                    alt={
                      pokemonSeleccionado.name
                    }
                  />

                </div>

              </div>


              {/* =================================
                  NOMBRE
              ================================= */}

              <Card.Title className="poke-titulo">

                {
                  pokemonSeleccionado.name.toUpperCase()
                }

              </Card.Title>


              {/* =================================
                  TIPOS
              ================================= */}

              <div className="tipo-contenedor">

                {pokemonSeleccionado.types.map(
                  (tipo) => (

                    <span
                      key={tipo.type.name}
                      className="badge-tipo"
                    >

                      {tipo.type.name.toUpperCase()}

                    </span>

                  )
                )}

              </div>


              {/* =================================
                  INFORMACIÓN
              ================================= */}

              <div className="info">


                <div className="stat-box">

                  <span className="stat-label">
                    NOMBRE
                  </span>

                  <Card.Text>
                    {pokemonSeleccionado.name}
                  </Card.Text>

                </div>


                <div className="stat-box">

                  <span className="stat-label">
                    PESO
                  </span>

                  <Card.Text>
                    {pokemonSeleccionado.weight / 10} kg
                  </Card.Text>

                </div>


                <div className="stat-box">

                  <span className="stat-label">
                    ALTURA
                  </span>

                  <Card.Text>
                    {pokemonSeleccionado.height / 10} m
                  </Card.Text>

                </div>

              </div>


              {/* =================================
                  ESTADÍSTICAS
              ================================= */}

              <div className="stats">

                {pokemonSeleccionado.stats.map(
                  (stat) => (

                    <div
                      className="stat-row"
                      key={stat.stat.name}
                    >

                      <span>
                        {stat.stat.name.toUpperCase()}
                      </span>


                      <div className="stat-valor">

                        <div
                          className="barra-stat"
                          style={{
                            width: `${Math.min(
                              stat.base_stat,
                              100
                            )}%`
                          }}
                        ></div>


                        <strong>
                          {stat.base_stat}
                        </strong>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* =================================
                  PARTE INFERIOR
              ================================= */}

              <div className="card-bottom">

                <span>
                  ID: #{pokemonSeleccionado.id}
                </span>


                <span className="estrellas">
                  ✦ ✦ ✦ ✦ ✦
                </span>

              </div>


              {/* =================================
                  BOTÓN
              ================================= */}

              <Button
                variant="dark"
                className="boton-cerrar"
                onClick={cerrarModal}
              >

                CERRAR

              </Button>


            </Card>

          )}

        </Modal.Body>

      </Modal>

    </div>

  )

}

export default App