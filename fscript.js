// plugin script :
displayname="Scripter";
versionstring="1.0.0";
releasedatestring="Jan 1st, 2008";
author="Author";
updateurl="";
homepageurl="";
shortdescription="Scripter";
longdescription="Scripter";
advconfigstring="Scripter";
readmestring="Scripter";
iconfilename="Scripter.ico";

aliasstr="scripter";
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

function setStatusBar() { }
function setSearch() { }
function setSearchNoGo() { }
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

function error(txt) {
    displayAlertMessage(txt);
}

plugins={}
var fso=new ActiveXObject("Scripting.FileSystemObject");
function getTextFile(path) {
    return fso.OpenTextFile(path).ReadAll();
}

function onInit(directory) {
    var f = fso.GetFolder(directory+"\\..");
    var fc = new Enumerator(f.SubFolders);
    var tmp="";
    for (; !fc.atEnd(); fc.moveNext())
    {
        try {            
            if(fso.FileExists(fc.item()+"\\scripter.js"))
                eval(getTextFile(fc.item()+"\\scripter.js"))
        } catch(e) {
            error("error occured while loading "+fc.item().Name+"\\scripter.js\n"+e);
        }
    }    
}

function onSearchBegin(querykey, explicit, queryraw, querynokeyword, modifier, triggermethod) {
	//error("search");
    FARR.setState(querykey,SEARCHING);
    var exactMatch=false;

    for(var i in plugins) {
        try {
            var isExplicit=queryraw.indexOf("scripter +"+i)==0;
            if(isExplicit) exactMatch=true;
            plugins[i].search(querykey, isExplicit, queryraw, modifier, triggermethod);
        } catch(e) { error("plugin "+i+" has failed on search : "+e); }
        //FARR.emitResult(querykey,i, "scripter "+i, iconfilename,UNKNOWN,IMMEDIATE_DISPLAY,1000);
    }
    if(!exactMatch && queryraw.indexOf("scripter")==0) {
        var m=queryraw.match(/^scripter ?(.*)/);
        for(var i in plugins) {
            if(i.indexOf(m[1])!=-1)
                FARR.emitResult(querykey,i, "scripter +"+i, iconfilename,ALIAS,MATCH_AGAINST_SEARCH,10000);
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
function ononDoAdvConfig() {
}
function onDoShowReadMe() {
}
function onSetStrValue(name, value) {
}
function onGetStrValue(name) {
}
function onOptionsChanged() {
}
