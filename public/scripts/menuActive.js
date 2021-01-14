
// CÓDIGO PARA MANTER LINK DO MENU SELECIONADO
    const currentPage = location.pathname

    // console.log(currentPage)
    const menuLinks = document.querySelectorAll( 'header nav .nav__links li a')
    for ( link of menuLinks ) {
        if ( currentPage.includes ( link.getAttribute ('href') )) {
            link.classList.add ( 'active' )
        }
}

// const menuLinks = document.querySelector('header nav ul li a')

// menuLinks.addEventListener('click', function() {
//     menuLinks.classList.add('active')
// })
        