// API KEY Am9O8LVsGgMmfg3S0Q9HGatYNbuymw0rsRDicAAn
const urlBase = 'https://api.nasa.gov/planetary/apod';
const apiKey = 'Am9O8LVsGgMmfg3S0Q9HGatYNbuymw0rsRDicAAn';

// Función para realizar la búsqueda de imágenes por palabra clave
function buscarImagenes(palabraClave = '') {
    let url;
    if (palabraClave.trim() === '') {
        // .TRIM Quita los espacios iniciales, finales y repetidos del texto.
        // Si no se proporciona una palabra clave, solicitar solo la imagen del día actual
        url = `${urlBase}?api_key=${apiKey}`;
    } else {
        // Si se proporciona una palabra clave, solicitar todas las imágenes
        url = `${urlBase}?api_key=${apiKey}&count=100&thumbs=true`;
    }

    // Mostrar indicador de carga
    document.getElementById('loader').style.display = 'block';

    // Realizar la solicitud a la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                mostrarResultados(data, palabraClave.toLowerCase());
            } else {
                mostrarResultados([data], palabraClave.toLowerCase());
            }
        })
        .catch(error => {
            console.error('Ha ocurrido un error:', error);
        })
        .finally(() => {
            // Ocultar indicador de carga después de completar la solicitud
            document.getElementById('loader').style.display = 'none';
        });
}

// Función para mostrar los resultados de la búsqueda en tarjetas
function mostrarResultados(data, palabraClave) {
    const container = document.getElementById('apodContainer');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }

    const imagenesFiltradas = data.filter(imagen => imagen.title.toLowerCase().includes(palabraClave));

    if (imagenesFiltradas.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }

    imagenesFiltradas.forEach(imagen => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = imagen.url;
        img.alt = imagen.title;
        img.classList.add('card-img-top');
        img.loading = 'lazy';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.textContent = imagen.title;
        title.classList.add('card-title');

        const date = document.createElement('p');
        date.textContent = imagen.date;
        date.classList.add('card-text');

        // Agregar evento de clic a la imagen para mostrar el modal con la explicación
        img.addEventListener('click', () => {
            mostrarModal(imagen.title,  imagen.explanation);
        });

        cardBody.appendChild(title);
        cardBody.appendChild(date);

        card.appendChild(img);
        card.appendChild(cardBody);

        container.appendChild(card);
    });
}

// Función para mostrar el modal con la explicación de la imagen
function mostrarModal(title, explanation) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerHTML = `<span class="close">&times;</span><h2>${title}</h2>`;

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.textContent = explanation;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modal.appendChild(modalContent);

    // Agregar evento de clic al botón de cierre del modal
    modalHeader.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Mostrar el modal
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Event listener para el formulario de búsqueda
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const palabraClave = document.getElementById('searchInput').value;
    buscarImagenes(palabraClave);
});

// Al cargar la página, buscar la imagen del día sin palabra clave
buscarImagenes();
