
// CÓDIGO PARA MANTER LINK DO MENU SELECIONADO
    const currentPageAdmin = location.pathname
    const menuLinks = document.querySelectorAll( 'section .links a')
    for ( link of menuLinks ) {
        if ( currentPage.includes ( link.getAttribute ('href') )) {
            link.classList.add ( 'active' )
        }
    }
        