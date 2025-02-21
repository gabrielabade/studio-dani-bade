
// Função para abrir e fechar as seções de informações
document.addEventListener("DOMContentLoaded", function () {
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
});
