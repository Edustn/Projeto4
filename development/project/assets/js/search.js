export function submitFormWithNewIndex(event, form) {
    let indexInput = document.querySelector("#index-exhibition");
    let EventValue = event.target.value; 
    let indexValue = EventValue; 
    let indexChange = {'n': 1, 'p': -1}
    if (indexChange[EventValue]) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        
        let newIndex = (parseInt(params.index) + parseInt(indexChange[EventValue]));

        if (newIndex < 1) {
            newIndex = 1;
        }

        indexValue = newIndex
    } 

    indexInput.value = indexValue;
    form.requestSubmit();
}

export function submitForm(event, form) {
    console.log("submit-index");
    form.requestSubmit();
}