import { submitFormWithNewIndex, submitForm } from "./search.js";

document.addEventListener('DOMContentLoaded', () => {
    let exhibitionForm = document.querySelector("#change-exhibition");
    
    if (exhibitionForm != undefined && exhibitionForm && exhibitionForm != null) {
        let buttonsChangeIndex = document.querySelectorAll("#change-exhibition .button-change-index");
        let maxRowsSelect = document.querySelector("#change-exhibition #maxRows");
        let maxRowsOption = document.querySelectorAll("#change-exhibition #maxRows option");


        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let maxRows = params.maxRows;

        maxRowsOption.forEach((element) => {
            if (element.value == maxRows) {
                element.selected = true;
            }
        });

        buttonsChangeIndex.forEach((element) => {
            element.addEventListener('click', (e) => {
                submitFormWithNewIndex(e, exhibitionForm);
            });
        });
    
        maxRowsSelect.addEventListener('change', (e) => {
            submitForm(e, exhibitionForm);
        })
    }
});
