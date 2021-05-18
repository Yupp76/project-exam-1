const pageBody = document.querySelector('body');
const navbarBtn = document.querySelector('#menuToggle input');
const navbarMenu = document.querySelector('#menu');


navbarBtn.addEventListener('click', (e) => {
    const isChecked = e.target.checked;

    if(isChecked) {
        pageBody.style.overflowY = "hidden";
        navbarMenu.classList.add('--nav-open');
    } else {
        pageBody.style.overflowY = "unset";
        navbarMenu.classList.remove('--nav-open');
    }    
})
