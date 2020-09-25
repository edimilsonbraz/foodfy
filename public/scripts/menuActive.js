
// CÓDIGO PARA MANTER LINK DO MENU SELECIONADO
    const currentPage = location.pathname
    const menuLinks = document.querySelectorAll( 'header nav .nav__links li a')
    for ( link of menuLinks ) {
        if ( currentPage.includes ( link.getAttribute ('href') )) {
            link.classList.add ( 'active' )
        }
    }
        