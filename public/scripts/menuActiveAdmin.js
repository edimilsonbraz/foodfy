// CÓDIGO PARA MANTER LINK DO MENU SELECIONADO
    const currentPageAdmin = location.pathname
    
    //  console.log(currentPageAdmin)
    const menuLinksAdmin = document.querySelectorAll( '.header.adm .links a')
    for ( link of menuLinksAdmin ) {
        if ( currentPageAdmin.includes ( link.getAttribute ('href') )) {
            link.classList.add ( 'active' )
        }
    }
        