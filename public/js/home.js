const greeting = document.querySelector('.greeting');
const fecha = document.querySelector('.fecha');
const email = sessionStorage.email;
const workedHours = document.querySelector('.workedHours');
const obsAvoided = document.querySelector('.obsAvoided');
const obsEncountered = document.querySelector('.obsEncountered');
const maxWeight = document.querySelector('.maxWeight');
const posturaDia = document.querySelector('.posturaDia')

var currentDate = new Date();



window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else{
        greeting.innerHTML = `Bienvenid@ ${sessionStorage.name}`;
        // Get today's date
        const today = new Date();
        // Get the day of the month
        const dayNum = today.getDate();
        // Get the month
        const month = today.getMonth();
        // Get the week day
        const day = today.getDay();
        const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const weekday = weekdays[day];
        // Create a string with the date in Spanish format
        const dateString = `${weekday} ${dayNum} de ${getMonthName(month)}`;
        // Add the date string to the top of the web app
        fecha.innerHTML = dateString;
        // Function to get the name of the month in Spanish
        function getMonthName(month) {
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        return months[month];
        }

        fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            
            const idFilter = data.filter(item => item.email === email);
            workedHours.innerHTML = idFilter[0].workedHours + " horas";
            obsEncountered.innerHTML = idFilter[0].obsDetected - idFilter[0].obsAvoided + " choques";
            obsAvoided.innerHTML = idFilter[0].obsAvoided + " evitados"; 
            maxWeight.innerHTML = idFilter[0].maxWeight + "kg";
            // Verifica si se supera el límite de 26 kg
            if (idFilter[0].maxWeight > 25) {
                // Si se supera, establece la clase CSS para texto en rojo
                maxWeight.classList.add('exceeded-limit');
            } else {
                // Si no se supera, establece la clase CSS para texto en verde
                maxWeight.classList.add('within-limit');
            }
            var correct = [idFilter[0].p1Correct, idFilter[0].p2Correct, idFilter[0].p3Correct, idFilter[0].p4Correct];
            var error = [idFilter[0].p1Error, idFilter[0].p2Error, idFilter[0].p3Error, idFilter[0].p4Error]

            // Configuración de Chart.js
            const labels = ["P1", "P2", "P3", "P4"];
            const chartData = {
            labels: labels,
            datasets: [
                {
                label: 'Correcta',
                data: correct,
                backgroundColor: '#75EC75',
                },
                {
                label: 'Errónea',
                data: error,
                backgroundColor: '#E76D62',
                },
            ]
            };

            const config = {
            type: 'bar',
            data: chartData,
            options: {
                plugins: {
                title: {
                    display: false,
                    text: 'Tu postura hoy'
                },
                },
                responsive: true,
                scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
                },
                elements: {
                    bar: {
                      borderRadius: 20 // Valor en píxeles para el radio de los bordes
                    }
                  }
            }
            };

            document.querySelectorAll('.p1, .p2, .p3, .p4').forEach(img => {
                img.style.display = 'inline'; // Cambia la visualización de las imágenes a 'inline'
            });

            const posturaDiaCanvas = document.getElementById('posturaDia');
            const myChart = new Chart(posturaDiaCanvas, config);
        })
        .catch(error => {
            console.error(error);
        });
        
        fetch('/api/week-data')
        .then(res => res.json())
        .then(data => {
        // Almacena los datos en la variable weekData
        const idFilter = data.filter(item => item.email === email);
        var weekData = idFilter;
        var errorsP1 = [];
        var errorsP2 = [];
        var errorsP3 = [];
        var errorsP4 = [];
        console.log(weekData.length)
        for (let i = 0; i < weekData.length; i++) {
            if (weekData[i].date) {
                errorsP1[i] = weekData[i].p1Error;
                errorsP2[i] = weekData[i].p2Error;
                errorsP3[i] = weekData[i].p3Error;
                errorsP4[i] = weekData[i].p4Error;
            }
          }
          const labels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
          const chartData = {
          labels: labels,
          datasets: [
              {
              label: 'Errores P1',
              data: errorsP1,
              backgroundColor: '#ace8ac',
              },
              {
              label: 'Errores P2',
              data: errorsP2,
              backgroundColor: '#376D6C',
              },
              {
              label: 'Errores P3',
              data: errorsP3,
              backgroundColor: '#78a2a2',
              },
              {
              label: 'Errores P4',
              data: errorsP4,
              backgroundColor: '#ace8e7',
              },
          ]
          };

          const config = {
          type: 'bar',
          data: chartData,
          options: {
              plugins: {
              title: {
                  display: false,
                  text: 'Tu postura esta semana'
              },
              },
              responsive: true,
              scales: {
              x: {
                  stacked: true,
              },
              y: {
                  stacked: true
              }
              },
              elements: {
                  bar: {
                    borderRadius: 20 // Valor en píxeles para el radio de los bordes
                  }
                }
          }
          };
          document.querySelectorAll('.w1, .w2, .w3, .w4').forEach(img => {
            img.style.display = 'inline'; // Cambia la visualización de las imágenes a 'inline'
        });
          const posturaSemanaCanvas = document.getElementById('posturaSemana');
          const myChart = new Chart(posturaSemanaCanvas, config);
  })
  .catch(error => {
    console.error('Error al obtener datos de la semana:', error);
  });


    }
}


const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}

