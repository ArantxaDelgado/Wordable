// Estado de nuestra APP. Fila y columna de donde "toca" escribir la siguiente letra
let row = 0;
let column = 0;
let secretWord = getNextWord();
let guessedWord = "";

//Esta función es la que nos va a permitir poner una letra en cada celda
function writeLetter(row, column, letter) {

    // 1. Obtener todas las celdas disponibles
    let cells = document.querySelectorAll(".game--cell");
    // Con el querySelector selecciono todas las celdas y las pongo dentro de un array
    // 2. Las celdas son nodos HTML. Debemos actualizar la propiedad textContent del nodo correspondiente a la fila y columna que nos pasan en la función

    // calculo la posición del nodo HTML en función de las filas y las columnas. Como no puedo acceder al numero de filas en sí tengo que encontrar una relación entre ellas y las columnas (1 fila = 5 columnas). entonces si quiero acceder a la fila 2 columna 3 ==> 1*5+3 = 8
    let position = row * 5 + column; //Tener en cuenta que al ser una array el objeto numero 1 esta en posición 0.
    cells[position].textContent = letter;
};

// Añadir un listener a todo el body, que detecte cada vez que dejamos ir una tecla aparezca por consola.
document.body.addEventListener("keyup", handleInput);
//Para que funcione el keyup tenemos que hacer una función que permita que cuando toquemos una tecla del teclado esta aparezca por pantalla
function handleInput(event) {
    // En el objeto event, tenemos la propiedad 'key', que nos va a informar de qué tecla ha pulsado el usuario
    let keyPressed = event.key;

    // Si la tecla pulsada es backspace, ver si podemos borrar la última letra. En tal caso, hacerlo
    if (event.key == "Backspace" && column != 0) {
        // 0. Eliminar el textContent de la posición actual
        // utilizar la función writeLetter para poner un espacio en blanco en el row y column actual

        column--;

        writeLetter(row, column, '');

        // 2. eliminar el último carácter 'guessedWord'
        // slice o substring

        guessedWord = guessedWord.slice(0, -1);

        return
    }

    // 2.2 Si hemos llegado a column ==5 --> comprobar la palabra secreta --> hacer un console.log("Comprobar palabra secreta").
    if (column == 5) {
        console.log(`Comparar ${secretWord} con ${guessedWord}`);
        if (event.key == "Enter") {
            // Comprobar si la palabra que he puesto existe y si esta en el sitio correcto
            checkRow(row)

            if (checkGameWon()) {
                document.querySelector(".victory").style.display = "block";
                document.body.removeEventListener("keyup", handleInput);
                return;
            }

            // cambiamos de fila
            row++;

            if (checkGameLoose()) {
                // hemos perdido
                // mostrar el mensaje de derrota
                document.querySelector(".defeat").style.display = "block";
                document.body.removeEventListener("keyup", handleInput);
                return;
            }

            //como es una nueva fila tenemos que empezar desde la primera columna
            column = 0;

            //reseteamos el valor de guessedWord para que no se acumule con el anterior (ej. pausacausa)
            guessedWord = "";
        }
        return
    }

    //Hacer que solo se acepten letras
    console.log(event.keyCode);
    //Si las teclas esta fuera del rango de las letras de la [a...z]; acabamos inmediatamente la función 
    if (event.keyCode < 65 || event.keyCode > 90) {
        return;
    }

    // 1. Invocar la función writeLetter para escribir la 'keyPressed' en la 'row' y 'column' que tocan
    writeLetter(row, column, keyPressed);
    guessedWord += keyPressed; // cada vez que apretamos una tecla esta se guarda en guessedWord seguida de la siguiente

    // 2. Actualizar el estado de nuestra APP
    // 2.1 Incrementar en 1 la variable 'column' cada vez que escribimos una letra nueva
    column++;
}

let keyboard = document.querySelector("#keyboard-cont")
keyboard.addEventListener("click", function keyboardInput(event) {
    let letter = event.target.textContent

    if (letter == "Del" && column != 0) {
        // 0. Eliminar el textContent de la posición actual
        // utilizar la función writeLetter para poner un espacio en blanco en el row y column actual

        column--;

        writeLetter(row, column, '');

        // 2. eliminar el último carácter 'guessedWord'
        // slice o substring

        guessedWord = guessedWord.slice(0, -1);

        if (condition) {

        }

        return
    }

    if (column == 5) {
        console.log(`Comparar ${secretWord} con ${guessedWord}`);
        if (letter == "Enter") {

            checkRow(row)

            if (checkGameWon()) {
                document.querySelector(".victory").style.display = "block";
                document.body.removeEventListener("click", keyboardInput);
                return;
            }

            row++;

            if (checkGameLoose()) {

                document.querySelector(".defeat").style.display = "block";
                document.body.removeEventListener("click", keyboardInput);
                return;
            }

            column = 0;

            guessedWord = "";
            guessedWord = guessedWord.slice(0, -5);
        }
        return
    }

    if (event.target.nodeName == "BUTTON") {
        //console.log(e.target.textContent);  
        writeLetter(row, column, letter);
        column++
        guessedWord += letter;

    }

})

// Comprobar si la palabra que he puesto existe y si esta en el sitio correcto
function checkRow(row) {
    // 1. Como la variable cell que contiene el array con todas las celdas esta dentro de otra función la tengo que volver a declarar. Si la tuviera que declarar muchas más veces debería plantearme hacerla una variable de estado de la APP
    let cells = document.querySelectorAll(".game--cell");

    let scoreLetters = correctPlace(secretWord, guessedWord);

    //Las letras tendran diferente color dependiendo de si: no existen en la palabra, estan en el lugar equivocado o estan en el lugar correcto.
    scoreLetters.forEach((score, index) => {
        let position = row * 5 + index;

        switch (score) {
            case -1:
                cells[position].classList.add("cell__wrong");
                break;

            case 0:
                cells[position].classList.add("cell__another");
                break;

            case 1:
                cells[position].classList.add("cell__correct");
                break;
        }
    });
}

//Separar cada una de las letras segun si existen, si estan dentro de la palabra o estan el lugar correcto  
function correctPlace(secretWord, guessedWord) {
    // array para guardar outcome
    let outcome = [];
    // for para comprobar cada carácter del string introducido
    for (let i = 0; i < guessedWord.length; i++) {
        // comprobamos si se encuentra el mismo carácter en la palabra secreta 
        if (guessedWord[i] == secretWord[i]) {
            outcome.push(1);
            //comprobamos si la palabra secreta contiene el carácter sin importar la posición
        } else if (secretWord.includes(guessedWord[i])) {
            outcome.push(0);
            //no contiene el carácter asi que lo valoramos con -1
        } else {
            outcome.push(-1);
        }
    }//devolvemos array con los datos
    return outcome;
}

// Devuelve TRUE si hemos acertado la palabra secreta
function checkGameWon() {
    return guessedWord == secretWord
}

// Devuelve TRUE si hemos agotado todos los intentos
function checkGameLoose() {
    //si estamos en la fila 6, hemos perdido
    return row == 6
};