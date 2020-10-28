const allFormsDelete = document.querySelectorAll("#delete-user");

for (const formDelete of allFormsDelete) {
    formDelete.addEventListener("submit", function(event) {
        const confirmation = confirm("Tem certeza que deseja excluir sua conta? Essa operação não podera ser desfeita");
        
        if(!confirmation){
            event.preventDefault();
        }
    });
}