
let inputUrl = document.getElementById("input-url");
let inputTitle = document.getElementById("input-title")
let inputCategory = document.getElementById("input-category")
let inputScript = document.getElementById("input-script")
let btn = document.getElementById("send")
let btnSave = document.getElementById("save")
let sheetLink = document.getElementById("sheet-link");




    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        inputUrl.value = tab[0].url;
        inputTitle.value = tab[0].title
    });

    chrome.storage.sync.get(['bookmark'], function (result) {
        inputScript.value = result.bookmark || "add your web app api url here"
        if (result.bookmark) {
            fetch(result.bookmark)
                .then((res) => res.json())
                .then(text => {
                    sheetLink.setAttribute('href', text.spreadsheetURL )
                    sheetLink.innerText = "Go to sheet"
                  
                    text.categories.forEach(function (element, key) {
                        inputCategory[key] = new Option(element, element);
                    });
                })
                
        }
    });






btnSave.addEventListener("click", e => {
    e.preventDefault();

    chrome.storage.sync.set({ "bookmark": inputScript.value }, function () {
        btnSave.innerText = "saved"
    });

})

btn.addEventListener("click", function (e) {

    e.preventDefault();


    let data = {
        url: inputUrl.value,
        title: inputTitle.value,
        category: inputCategory.value
    }
    btn.innerText = "sending..."
    fetch(inputScript.value, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.text())
        .then(r=>{
            console.log(r)
            btn.innerText = "Sent successfully!"
            setTimeout(()=>{ btn.innerText = "Send"},1000)
        })
        .catch(function (err) {
            console.log("Problem");
            alert(err);
        });

});
