function viewMode(){
    let filterBox = window.document.getElementById("filter-box");

    if (filterBox.style.display === "none"){
        filterBox.style.display = "block";
    } else {
        filterBox.style.display = "none"
    };
};