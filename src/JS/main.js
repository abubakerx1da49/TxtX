let { ipcRenderer, shell, BrowserWindow, screen } = require('electron');



// Editor
var editor = ace.edit("editor");
// editor.renderer.setShowGutter(false);
editor.session.setUseWrapMode(true);



// Title Bar JS
document.getElementById("quit-button").addEventListener("click", () => {
    ipcRenderer.send('quit-app')
})

// document.getElementById("refresh_btn").addEventListener("click", () => {
//     ipcRenderer.send('reload-app')
// })

document.getElementById("minimize-button").addEventListener("click", () => {
    ipcRenderer.send('minimize-app')
})

document.getElementById("maximize-button").addEventListener("click", () => {
    ipcRenderer.send('maximize-app')
    ipcRenderer.on("maximizing-icon", (event, icon) => {
        // if (icon == "Max") {
        //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app"></i>`
        // } else if (icon == "UnMax") {
        //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app-indicator"></i>`
        // }
    })
})

ipcRenderer.on('asynchronous-message', function (evt, message) {
    let icon = message.icon;
    // console.log(icon)
    // if (icon == "Max") {
    //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app-indicator"></i>`
    // } else if (icon == "UnMax") {
    //     document.getElementById("maximize-button").innerHTML = `<i class="bi bi-app"></i>`
    // }
});

