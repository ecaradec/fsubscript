// plugin script :
displayname="FARRSubScript";
versionstring="1.0.0";
releasedatestring="Jan 1st, 2008";
author="Author";
updateurl="";
homepageurl="";
shortdescription="FSubScript";
longdescription="FSubScript";
advconfigstring="FSubScript";
readmestring="FSubScript";
iconfilename="FSubScript.ico";

aliasstr="fssc";
regexstr="";
regexfilterstr="";
keywordstr="";
scorestr="300";

// type
UNKNOWN=0; FILE=1; FOLDER=2; ALIAS=3; URL=4; PLUGIN=5; CLIP=5;
// Postprocessing
IMMEDIATE_DISPLAY=0; ADDSCORE=1; MATCH_AGAINST_SEARCH=2;
// search state
STOPPED=0; SEARCHING=1;

HANDLED=1; CLOSE=2;

function setStatusBar(txt) { }
function setSearch(txt) { FARR.setStrValue("setsearch",txt); }
function setSearchNoGo() { FARR.setStrValue("setsearchnogo",txt); }
function stopSearch() { }
function hideWindow() { }
function showWindow() { }
function toggleWindow() { }
function setRichEditMode() { }
function setRichEditHeight() { }
function setRichEditWidth() { }
function setShowAllMode() { }
function exit() { }
function reportError(txt) { }
function setCliboard() { }
function pasteClipboardToLastActiveWindow(txt) { FARR.setStrValue("PasteClipboardToLastActiveWindow", txt) }
function displayAlertMessage(txt) { FARR.setStrValue("DisplayAlertMessage",txt); }
function displayAlertMessageNoTimeout() { }
function displayBalloonMessage() { }
function execWebbrowserEmbededJavascript() { }

function restartSearch(txt) { FARR.setStrValue("launch","restartsearch "+txt); }
function doSearch(txt) { FARR.setStrValue("launch","dosearch "+txt); }
function doSearchOnTrigger(txt) { FARR.setStrValue("launch","dosearchontrigger "+txt); }

function error(txt) {
    displayAlertMessage(txt);
}

plugins={}
/*plugins["settings"]={
    search:function(querykey, explicit, queryraw, querynokeyword, modifier, triggermethod) {
        if(!explicit) return;
       
        FARR.emitResult(querykey,"Settings","Settings", this.icon,CLIP,MATCH_AGAINST_SEARCH,10000,"fssc/settings");
    },
    trigger:function(path, title, groupname, pluginid, thispluginid, score, entrytype, args) {
        if(groupname!="fssc/settings") return;

        FARR.exec(g_currentDirectory+"\\FSSCSettings.ahk", str, "");
        //onDoAdvConfig();
        return HANDLED;
    }
}*/

var fso=new ActiveXObject("Scripting.FileSystemObject");
function getTextFile(path) {
    var f=fso.OpenTextFile(path);
    var txt=f.ReadAll();
    f.Close();
    return txt;
}

var g_currentDirectory;
function onInit(directory) {
    g_currentDirectory=directory;
    var f = fso.GetFolder(directory+"\\..");
    var fc = new Enumerator(f.SubFolders);
    var tmp="";
    for (; !fc.atEnd(); fc.moveNext())
    {
        try {
            var currentDirectory=fc.item();
            if(fso.FileExists(fc.item()+"\\fsubscript.js"))
                eval(getTextFile(fc.item()+"\\fsubscript.js"))
        } catch(e) {
            error("error occured while loading "+fc.item().Name+"\\fsubscript.js\n"+e);
        }
    }    
}
// mjet : multiple javascript extension for farr
function onSearchBegin(querykey, explicit, queryraw, querynokeyword, modifier, triggermethod) {
    FARR.setState(querykey,SEARCHING);
    var exactMatch=false;

    for(var i in plugins) {
        try {
            var isExplicit=queryraw.indexOf(aliasstr+" +"+i)==0;
            if(isExplicit) exactMatch=true;
            plugins[i].search(querykey, isExplicit, queryraw, modifier, triggermethod);
        } catch(e) { error("plugin "+i+" has failed on search : "+e); }
        //FARR.emitResult(querykey,i, "scripter "+i, iconfilename,UNKNOWN,IMMEDIATE_DISPLAY,1000);
    }
    if(!exactMatch && queryraw.indexOf(aliasstr)==0) {
        var m=queryraw.match(new RegExp("^"+aliasstr+" ?(.*)"));
        for(var i in plugins) {
            if(i.indexOf(m[1])!=-1)
                FARR.emitResult(querykey,i, plugins[i].autocomplete || (aliasstr+" +"+i), plugins[i].icon || iconfilename,ALIAS,MATCH_AGAINST_SEARCH,10000, plugins[i].autocomplete || (aliasstr+" +"+i));
        }
    }
    if(queryraw=="aplugins") {
        for(var i in plugins) {
            FARR.emitResult(querykey,(plugins[i].displayName || i) + " ("+plugins[i].version+" - "+plugins[i].lastChange+")", plugins[i].autocomplete || (aliasstr+" +"+i), plugins[i].icon || iconfilename, ALIAS, MATCH_AGAINST_SEARCH,99, plugins[i].autocomplete || (aliasstr+" +"+i));
        }
    }
	FARR.setState(querykey,STOPPED);
}

function onProcessTrigger(path, title, groupname, pluginid, thispluginid, score, entrytype, args) {
    for(var i in plugins) {
        try {
            var r=plugins[i].trigger(path, title, groupname, pluginid, thispluginid, score, entrytype, args);
            if(r&3!=0)
                return r; // stop if stop or closed is required
        } catch(e) { error("plugin "+i+" has failed on trigger : "+e) }
    }
}
function onReceiveKey(key, altpressed, controlpressed, shiftpressed) {
    for(var i in plugins) {
        try {
            var r=plugins[i].receivekey(key, altpressed, controlpressed, shiftpressed);
            if(r)
                return true;
        } catch(e) { error("plugin "+i+" has failed on received key : "+e) }
    }
}
function onWin32Message(wparam,lparam) {
    var SHOW_SUBPLUGIN_CONFIG=0;
    var RELOAD_SUBPLUGINCONFIG=1;
    if(wparam==SHOW_SUBPLUGIN_CONFIG) {
        FARR.debug(""+lparam);
        var index=0;
        for(var i in plugins) {
            if(index==lparam-1)
                break;
            index++;
        }
        plugins[i].showSettings();
    } else if(wparam==RELOAD_SUBPLUGINCONFIG) {
        var index=0;
        for(var i in plugins) {
            if(index==lparam-1)
                break;
            index++;
        }
        plugins[i].settingsChanged();
    }
}
function onDoAdvConfig() {
    var str="";
    for(var i in plugins) {
        str+=(i+" ");
    }
    FARR.exec(g_currentDirectory+"\\FSSCSettings.exe", str, g_currentDirectory);
    //FARR.exec(g_currentDirectory+"\\FSSCSettings.ahk", str, g_currentDirectory);
    return true;
}
function onDoShowReadMe() {
}
function onSetStrValue(name, value) {
}
function onGetStrValue(name) {
}
function onOptionsChanged() {
}
