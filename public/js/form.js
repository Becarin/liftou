//animacion de carga del formulario
const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100);
})

window.onload = () => {
    if(sessionStorage.name){
        location.href = '/';
    }
}

//validación del formulario

const userName = document.querySelector('.name') || null;
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

const onEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar la acción por defecto del formulario

        submitBtn.click();
    }
};

// Agregar el evento keydown a los campos de formulario para detectar "Enter"
[userName, email, password].forEach((input) => {
    if (input) {
        input.addEventListener('keydown', onEnter);
    }
});

if(userName == null){ // quiere decir que la pagina de inicio de sesion está abierta
    submitBtn.addEventListener('click', () => {
        fetch('/login-user', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
    })
}else{ //quiere decir que la página de registro está abierta

    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post', 
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                name: userName.value, 
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())

        .then(data => { //de esta forma se envian datos al servidor en js
            validateData(data);
        })
    })

}

const validateData = (data) => {
    if(!data.name){
        alertBox(data);
    } else{
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        location.href = '/';
    }
}

const alertBox = (data) => {
    const alertContainter = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainter.style.top = '5%';
    setTimeout(() => {
        alertContainter.style.top = null;
    }, 5000);
}