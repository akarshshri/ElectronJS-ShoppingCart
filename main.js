const electron = require('electron');
const url = require('url');
const path = require('path');

const {BrowserWindow, app, Menu} = electron;

let mainWindow;
let addWindow;

//Listen for the app to be ready
app.on('ready',function(){
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load HTML into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:  'file:',
        slashes: true
    }))
    //Quit app when Main window is closed
    mainWindow.on('closed', ()=>{
        app.quit();
    })


    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
})

// Handle create add window

function createAddWindow(){
    //create new window
    addWindow = new BrowserWindow({
        width: 700,
        height: 700,
        title: 'Add Shopping List Item'
    });
    //Load HTML into Window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:  'file:',
        slashes: true
    })) ;
    //Garbage Collection handle
        addWindow.on('close',()=>{
            addWindow = null;
        })

    
}

//Create Menu template
const mainMenuTemplate = [{
    label:'File',
    submenu:[
        {
            label: 'Add Item',
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear Item'
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin'? 'command+Q':'Ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]
}];

//If MAC, add empty object to menu
if(process.platform =='darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tool item if not in production
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tool',
        submenu: [
            {
                label: 'Toggle Devtool',
                accelerator: process.platform == 'darwin'? 'command+I':'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}