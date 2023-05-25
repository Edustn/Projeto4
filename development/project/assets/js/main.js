import { submitFormWithNewIndex, submitForm } from "./search.js";

document.addEventListener('DOMContentLoaded', () => {
    let exhibitionForm = document.querySelector("#change-exhibition");
    
    if (exhibitionForm != undefined && exhibitionForm && exhibitionForm != null) {
        let buttonsChangeIndex = document.querySelectorAll("#change-exhibition .button-change-index");
        let maxRowsSelect = document.querySelector("#change-exhibition #maxRows");
        let indexInput = document.querySelector("#index-exhibition");
        let qtdMaxRows = document.querySelector("#qtdMaxRows");
        let q = document.querySelector("#q");

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        
        q.value = params.q;
        indexInput.value = params.index;
        maxRowsSelect.value = params.maxRows;
        qtdMaxRows.textContent = params.maxRows;

        buttonsChangeIndex.forEach((element) => {
            if (element.value == params.index) {
                element.classList.add("actual-page");
            }
            element.addEventListener('click', (e) => {
                submitFormWithNewIndex(e, exhibitionForm);
            });
        });
    
        maxRowsSelect.addEventListener('change', (e) => {
            submitForm(e, exhibitionForm);
        })
    }
});
