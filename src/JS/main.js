let { ipcRenderer, shell, BrowserWindow, screen } = require('electron');
let fs = require('fs')

let open_file_btn = document.getElementById("open_file_btn");
let close_file_btn = document.getElementById("close_file_btn");

let appbar_section = document.getElementById("appbar_section");
let status_section = document.getElementById("status_section");


open_file_btn.addEventListener("click", () => {
    ipcRenderer.send('click-open-button', 'true')
    let iteration = 1
    ipcRenderer.on('fileData_Open', (event, data) => {

        if (iteration == 1) {

            let filedata = data.filedata

            let lastIndexOfString = String(data.filepath).lastIndexOf("\\")
            let filename = String(data.filepath).slice(lastIndexOfString + 1, String(data.filepath).length)

            // File Path in Status Bar
            document.getElementById("filename").innerText = filename


            let editorElem = document.createElement('div')
            editorElem.id = `editor`
            editorElem.classList += "editor"
            document.getElementById("editor_section").appendChild(editorElem)

            
            var editor = ace.edit("editor");
            editor.renderer.setShowGutter(false);
            editor.session.setUseWrapMode(true);

            editor.setValue(filedata, 1)

            open_file_btn.style.display = "none"
            close_file_btn.style.display = "block"
            status_section.style.display = "flex"
            appbar_section.style.borderBottom = "2px solid transparent"
            
            editor.addEventListener("input", () => {
                // File Saving
                try {
                    fs.writeFileSync(data.filepath, editor.getValue())
                } catch (err) {
                    console.error(err)
                }
            })



            iteration += 1

        }

    })
})

close_file_btn.addEventListener("click", () => {

    close_file_btn.style.display = "none"
    open_file_btn.style.display = "block"
    status_section.style.display = "none"
    appbar_section.style.borderBottom = "2px solid var(--min-color)"

    document.getElementById("editor").remove()
    // document.getElementById("editor").innerHTML = ""
    // console.log(document.getElementById("editor").classList.remove(" ace_editor ace-tm"))
    // document.getElementById("editor").classList.remove("ace_editor")
    // document.getElementById("editor").classList.remove("ace-tm")

})


// For Theme Change
let r = document.querySelector(':root');

setInterval(() => {


    // For Dark Mode
    let DarkMode = document.getElementById("DarkMode").checked;

    if (DarkMode == true) {
        r.style.setProperty('--theme-background', '#191919');
        r.style.setProperty('--theme-background-2', '#121212');
        r.style.setProperty('--editor-background', '#202020');
        r.style.setProperty('--theme-color', 'white');
        r.style.setProperty('--min-color', 'lightblue');
        r.style.setProperty('--max-color', 'lightgreen');
        r.style.setProperty('--shadow-color', '#191919');
    } else {
        r.style.setProperty('--theme-background', 'lightgray');
        r.style.setProperty('--theme-background-2', 'white');
        r.style.setProperty('--editor-background', '#F0F0F0');
        r.style.setProperty('--theme-color', 'black');
        r.style.setProperty('--min-color', 'blue');
        r.style.setProperty('--max-color', 'green');
        r.style.setProperty('--shadow-color', 'darkgray');
    }


}, 250);



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

