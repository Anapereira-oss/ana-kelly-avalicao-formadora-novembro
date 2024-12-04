document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    // Limitar a senha a 7 caracteres
    const senha = document.getElementById("password");
    senha.addEventListener("input", function () {
        if (senha.value.length > 7) {
            senha.value = senha.value.slice(0, 7);
        }
    });

    // Limitar a confirmação de senha a 7 caracteres e garantir que as senhas sejam iguais
    const confirmPassword = document.getElementById("confirmpassword");
    confirmPassword.addEventListener("input", function () {
        if (confirmPassword.value.length > 7) {
            confirmPassword.value = confirmPassword.value.slice(0, 7);
        }
        // Verificar se as senhas são iguais
        if (confirmPassword.value !== senha.value) {
            confirmPassword.setCustomValidity("As senhas não são iguais.");
        } else {
            confirmPassword.setCustomValidity("");
        }
    });

    // Limitar o login a 5 caracteres maiúsculos
    const login = document.getElementById("login");
    login.addEventListener("input", function () {
        if (login.value.length > 5) {
            login.value = login.value.slice(0, 5);
        }
        login.value = login.value.toUpperCase(); 
    });

    // Formatar e validar números de telefone e celular
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');

        // Adicionar +55 automaticamente se não estiver presente
        if (!value.startsWith("55")) {
            value = "55" + value;
        }

        if (value.length <= 4) {
            input.value = "+" + value;
        } else if (value.length <= 9) {
            input.value = "+" + value.slice(0, 2) + " (" + value.slice(2, 4) + ") " + value.slice(4);
        } else {
            input.value = "+" + value.slice(0, 2) + " (" + value.slice(2, 4) + ") " + value.slice(4, 9) + "-" + value.slice(9, 13);
        }
    }

    // Regras para validar celular e telefone fixo
    function validarCelular(celular) {
        celular = celular.replace(/\D/g, '');
        const regexCelular = /^55\d{2}9\d{4}\d{4}$/; 
        return regexCelular.test(celular);
    }

    function validarTelefoneFixo(telefoneFixo) {
        telefoneFixo = telefoneFixo.replace(/\D/g, '');
        const regexFixo = /^55\d{2}[2-5]\d{3}\d{4}$/; 
        return regexFixo.test(telefoneFixo);
    }

    document.getElementById('celular').addEventListener('input', function (e) {
        formatPhoneNumber(e.target);
    });

    document.getElementById('telefonefixo').addEventListener('input', function (e) {
        formatPhoneNumber(e.target);
    });

    // Função para formatar CPF no formato xxx.xxx.xxx-xx
    function formatarCPF(cpf) {
        let valor = cpf.replace(/\D/g, ''); // Remove tudo que não for número
        if (valor.length <= 3) {
            return valor;
        } else if (valor.length <= 6) {
            return valor.slice(0, 3) + '.' + valor.slice(3);
        } else if (valor.length <= 9) {
            return valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6);
        } else {
            return valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6, 9) + '-' + valor.slice(9, 11);
        }
    }

    // Aplicar a formatação ao digitar no campo CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function () {
        cpfInput.value = formatarCPF(cpfInput.value);
    });

    // Validação CPF (inclui dígitos verificadores)
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf[10]);
    }

    // Validação no envio do formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let isValid = true;

        // Verificar se a senha tem menos de 7 caracteres
        if (senha.value.length < 7) {
            alert("A senha deve ter pelo menos 7 caracteres.");
            isValid = false;
        }

        // Verificar se o login tem menos de 5 caracteres
        if (login.value.length < 5) {
            alert("O login deve ter pelo menos 5 caracteres.");
            isValid = false;
        }

        // Validação Nome
        const name = document.getElementById("name");
        const nameError = createErrorElement(name, "Nome deve ter pelo menos 10 caracteres e começar com letra maiúscula.");
        const nameRegex = /^[A-Z][a-zA-Z\s]{9,}$/;
        if (!nameRegex.test(name.value)) {
            isValid = false;
            nameError.style.display = "block";
        } else {
            nameError.style.display = "none";
        }

        // Validação Nome Materno 
        const nomeMaterno = document.getElementById("nomematerno");
        const nomeMaternoError = createErrorElement(nomeMaterno, "Nome materno deve ter pelo menos 10 caracteres e começar com letra maiúscula.");
        if (!nameRegex.test(nomeMaterno.value)) {
            isValid = false;
            nomeMaternoError.style.display = "block";
        } else {
            nomeMaternoError.style.display = "none";
        }

        // Validação CPF
        const cpf = document.getElementById("cpf");
        const cpfError = createErrorElement(cpf, "CPF inválido ou no formato errado.");
        if (!validarCPF(cpf.value)) {
            isValid = false;
            cpfError.style.display = "block";
        } else {
            cpfError.style.display = "none";
        }

        // Validação Celular
        const celular = document.getElementById("celular");
        const celularError = createErrorElement(celular, "Celular inválido. Deve começar com +55, seguido de um 9.");
        if (!validarCelular(celular.value)) {
            isValid = false;
            celularError.style.display = "block";
        } else {
            celularError.style.display = "none";
        }

        // Validação Telefone Fixo
        const telefoneFixo = document.getElementById("telefonefixo");
        const telefoneFixoError = createErrorElement(telefoneFixo, "Telefone fixo inválido. Deve começar com +55, seguido de 2, 3, 4 ou 5.");
        if (!validarTelefoneFixo(telefoneFixo.value)) {
            isValid = false;
            telefoneFixoError.style.display = "block";
        } else {
            telefoneFixoError.style.display = "none";
        }

        if (isValid) {
            form.submit();
        }
    });

    // Função para criar elementos de erro
    function createErrorElement(inputElement, message) {
        let errorElement = inputElement.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement("div");
            errorElement.classList.add('error-message');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
        return errorElement;
    }
});
