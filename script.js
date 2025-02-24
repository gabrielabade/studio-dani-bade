document.addEventListener("DOMContentLoaded", function () {
  // Adiciona eventos de clique para todas as seções
  function toggleContent(section) {
    let content = document.querySelector(`.${section}`);
    let icon = document.querySelector(`.${section}`).previousElementSibling.querySelector("ion-icon");

    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
      icon.setAttribute("name", "chevron-up-outline");
    } else {
      content.style.display = "none";
      icon.setAttribute("name", "chevron-down-outline");
    }
  }

  document.querySelectorAll(".information").forEach((element) => {
    element.addEventListener("click", function () {
      let sectionClass = this.nextElementSibling.classList[1]; // Obtém a classe específica do conteúdo associado
      toggleContent(sectionClass);
    });
  });

  // Configura o envio de formulário para o WhatsApp
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Coleta os dados do formulário
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const telefone = document.getElementById("telefone").value;

      // Coleta os serviços selecionados
      const servicos = [];
      document.querySelectorAll('input[name="servicos"]:checked').forEach(checkbox => {
        servicos.push(checkbox.value);
      });

      // Coleta outros dados do formulário
      const mensagem = document.getElementById("mensagem").value;
      const dataPreferida = document.getElementById("data-preferida").value;
      const horarioPreferido = document.getElementById("horario-preferido").value;

      // Formata a mensagem para WhatsApp
      let whatsappMessage = `*Nova Solicitação de Agendamento*\n`;
      whatsappMessage += `*Nome:* ${nome}\n`;
      whatsappMessage += `*E-mail:* ${email}\n`;
      whatsappMessage += `*Telefone:* ${telefone}\n`;
      whatsappMessage += `*Serviços:* ${servicos.join(", ")}\n`;

      if (dataPreferida) {
        const data = new Date(dataPreferida);
        const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
        whatsappMessage += `*Data Preferida:* ${dataFormatada}\n`;
      }

      if (horarioPreferido) {
        const horarios = {
          "manha": "Manhã (9h - 12h)",
          "tarde": "Tarde (13h - 16h)",
          "final-tarde": "Final da Tarde (16h - 19h)"
        };
        whatsappMessage += `*Horário:* ${horarios[horarioPreferido]}\n`;
      }

      if (mensagem) {
        whatsappMessage += `*Mensagem:* ${mensagem}\n`;
      }

      // Codifica a mensagem para URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Abre o WhatsApp com a mensagem pré-preenchida
      window.open(`https://wa.me/5551995415520?text=${encodedMessage}`, '_blank');

      // Limpa o formulário após envio
      contactForm.reset();
    });

    // Formatar campo de telefone como (xx) xxxxx-xxxx
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
      telefoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);

        // Formata o número conforme digita
        if (value.length > 0) {
          value = `(${value.slice(0, 2)})${value.length > 2 ? " " + value.slice(2, 7) : ""}${value.length > 7 ? "-" + value.slice(7, 11) : ""}`;
        }

        e.target.value = value;
      });
    }
  }
});
