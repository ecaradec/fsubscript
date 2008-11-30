// FARRSubScript-specific variables 
displayname="FARRSubScript";
versionstring="0.9.5"; // XXX: locally customized
releasedatestring="Nov 22nd, 2008";
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
// FARR constants
// type
UNKNOWN=0; FILE=1; FOLDER=2; ALIAS=3; URL=4; PLUGIN=5; CLIP=5;
// Postprocessing XXX: rename ADDSCORE -> ADD_SCORE ok?
IMMEDIATE_DISPLAY=0; ADD_SCORE=1; MATCH_AGAINST_SEARCH=2; ADD_SCORE_W_PATS=3;
MATCH_AGAINST_SEARCH_W_PATS=4;
// search state
STOPPED=0; SEARCHING=1;
//
HANDLED=1; CLOSE=2;
// FARR.setStrValue() wrappers
// XXX: global 'namespace' feels like it's getting crowded...
//      how about wrapping these up in an object?  also, automating 
//      their creation a bit?
function setStatusBar(txt) { FARR.setStrValue("statusbar", txt); }
function setSearch(txt) { FARR.setStrValue("setsearch", txt); }
function setSearchNoGo() { FARR.setStrValue("setsearchnogo", txt); }
function stopSearch() { FARR.setStrValue("stopsearch"); }
function hideWindow() { FARR.setStrValue("window.hide"); }
function showWindow() { FARR.setStrValue("window.show"); }
function toggleWindow() { FARR.setStrValue("window.toggle"); }
function setRichEditMode(txt) { FARR.setStrValue("window.richeditmode", txt); }
function setRichEditHeight(height) { 
  FARR.setStrValue("window.richeditheight", height); 
}
function setRichEditWidth(width) { 
  FARR.setStrValue("window.richeditwidth", width); 
}
function setShowAllMode() { FARR.setStrValue("setshowallmode"); }
function exit() { FARR.setStrValue("exit"); }
function reportError(txt) { FARR.setStrValue("reporterror", txt); }
function setCliboard() { FARR.setStrValue("clipboard"); }
function pasteClipboardToLastActiveWindow(txt) { 
  FARR.setStrValue("PasteClipboardToLastActiveWindow", txt) 
}
function displayAlertMessage(txt) { 
  FARR.setStrValue("DisplayAlertMessage", txt); 
}
function displayAlertMessageNoTimeout(txt) { 
  FARR.setStrValue("DisplayAlertMessageNoTimeout", txt); }
function displayBalloonMessage(txt) { 
  FARR.setStrValue("DisplayBalloonMessage", txt); 
}
function execWebbrowserEmbededJavascript(txt) { 
  FARR.setStrValue("EmbeddedWb.ExecJavascript", txt); 
}
function forceResultFilter(txt) { FARR.setStrValue("ForceResultFilter", txt); }
// launch-specific wrappers
function paste(txt) { FARR.setStrValue("launch", "paste " + txt); }
function copyClip(txt) { FARR.setStrValue("launch", "copyclip " + txt); }
function restartSearch(txt) { 
  FARR.setStrValue("launch", "restartsearch " + txt); 
}
function doSearch(txt) { FARR.setStrValue("launch", "dosearch " + txt); }
function doSearchOnTrigger(txt) { 
  FARR.setStrValue("launch", "dosearchontrigger " + txt); 
}
// txt: text with \n as newlines
function showMemo(txt) { FARR.setStrValue("launch", "showmemo " + txt); }
function showFile(filename) { 
  FARR.setStrValue("launch", "showfile " + filename); 
}
function showFileRTF(filename) { 
FARR.setStrValue("launch", "showfilertf " + filename); 
}
function showFileHTML(filename) { 
  FARR.setStrValue("launch", "showfilehtml " + filename); 
}
function showHTML(txt) { FARR.setStrValue("launch", "showhtml " + txt); }
// txt: url
function htmlViewURL(txt) { 
  FARR.setStrValue("launch", "htmlviewurl " + txt); 
}
// txt: searchedit, mainpanel
function setFocus(txt) { FARR.setStrValue("launch", "setfocus " + txt); }
// txt: list, memo, html, user, spreadsheet
function setViewMode(txt) { 
  FARR.setStrValue("launch", "setviewmode " + txt); 
} 
function pcommand(txt) { FARR.setStrValue("launch", "pcommand " + txt); }
function setSize(minwidth, minheight, maxwidth, maxheight) { 
  FARR.setStrValue("launch", "setsize " +
                   minwidth + ", " + minheight + ", " +
                   maxwidth + ", " + maxheight);
}
// XXX: bool: 0 or 1?
function setHTMLSafe(bool) { 
  FARR.setStrValue("launch", "sethtmlsafe " + bool); 
} 
function showPleaseWait(txt) { 
  FARR.setStrValue("launch", "showpleasewait " + txt); 
}
function hidePleaseWait() { FARR.setStrValue("launch", "hidepleasewait"); }
//function alert(txt) { FARR.setStrValue("launch", "alert " + txt); }
function sleep(ms) { FARR.setStrValue("launch", "sleep " + ms); }
// 
function error(txt) {
  displayAlertMessage(txt);
}
var plugins = {}
var fso = new ActiveXObject("Scripting.FileSystemObject");
function getTextFile(path) {
  var f = fso.OpenTextFile(path);
  var txt = f.ReadAll();
  f.Close();
  return txt;
}
var g_currentDirectory;
function onInit(directory) {
  g_currentDirectory = directory;
  var f = fso.GetFolder(directory + "\\..");
  var fc = new Enumerator(f.SubFolders);
  var tmp = "";
  for (; !fc.atEnd(); fc.moveNext())
  {
    try {
      var currentDirectory = fc.item();
      if (fso.FileExists(fc.item() + "\\fsubscript.js")) {
        eval(getTextFile(fc.item() + "\\fsubscript.js"));
      }
    } catch(e) {
      error("error occured while loading " + 
            fc.item().Name + "\\fsubscript.js\n" + 
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
}
function onSearchBegin(querykey, explicit, queryraw, querynokeyword, 
                       modifier, triggermethod) {
  function cleanup(errortxt) { 
    if (errortxt) {
      reportError("FSubScript Warning: " + errortxt);
    }
    FARR.setState(querykey, STOPPED); 
  }
  FARR.setState(querykey, SEARCHING);
  // (q)uery (m)atch (a)rray
  var qma = queryraw.match("([^ ]+) ?(.*)");
  if (!qma) { cleanup("unexpected non-match of query"); return; }
  var first = qma[1];
  if (!first) { cleanup("unexpected false match result"); return; } 
  var rest = qma[2];
  if (first == "aplugins") {
    for (var i in plugins) {
      var title = (plugins[i].displayName || i) + " (" + 
                  plugins[i].version + " - " + 
                  plugins[i].lastChange + ")";
      FARR.emitResult(querykey, title, plugins[i].aliasstr, 
                      plugins[i].icon || iconfilename, ALIAS, 
                      MATCH_AGAINST_SEARCH, 99, plugins[i].aliasstr);
    }
    cleanup(); return;
  }
  // execute search() for each plugin unless...see below
  for (var i in plugins) {
    try {
      // (p)lugin (a)lias (m)atched?
      //var pam = queryraw.indexOf(plugins[i].aliasstr) == 0; // XXX
      var pam = (plugins[i].aliasstr == first);
      plugins[i].search(querykey, pam, queryraw, querynokeyword, 
                        modifier, triggermethod);
      if (pam) {
        if (!(plugins[i].regexstr)) {
          // if script is NOT a regex script but triggered because first word 
          // of search = pattern word of script THEN set filter to everything 
          // after first word
	  forceResultFilter(rest);
        } else {
          // if script is REGEX script default action should be NOT to filter 
          // -- except if there is a regexsearchfilter property for script 
	  // (p)lugin (r)egex (s)earch (f)ilter
	  //var prsf = plugins[i].regexsearchfilter;
          // -- approximating initially by using regexfiltergroup 
	  // (p)lugin (r)egex (f)ilter (g)roup
	  var prfg = plugins[i].regexfiltergroup;
          if (prfg) {
            // (p)lugin (q)uery (m)atch (a)rray
            var pqma = queryraw.match(plugins[i].regexstr);
            if (!pqma) { 
              cleanup("unexpected plugin regex match failure"); return; 
            } 
            if (!pqma[prfg]) { 
              cleanup("unexpected false plugin match result"); return; 
            } 
            forceResultFilter(pqma[prfg]);
          }
	}
	// 2008-11-19 mouser: search should only STOP on the EXACT match
        stopSearch();
        break;
      }
    } catch(e) { 
      error("plugin " + i + " has failed on search : " + 
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
  cleanup(); return;
}
function onProcessTrigger(path, title, groupname, pluginid, thispluginid,
                          score, entrytype, args) { 
  for (var i in plugins) {
    try {
      var r = plugins[i].trigger(path, title, groupname, pluginid, 
                                 thispluginid, score, entrytype, args);
      if ((r & 3) != 0) // XXX: may be we can use 'constants' for readability?
        return r; // stop if stop or closed is required
      } catch(e) { 
        error("plugin " + i + " has failed on trigger : " + 
              "message: " + e.message + " " + "name: " + e.name);
      }
  }
}
function onReceiveKey(key, altpressed, controlpressed, shiftpressed) {
  for (var i in plugins) {
    try {
      var r = plugins[i].receivekey(key, 
                                    altpressed, controlpressed, shiftpressed);
      if (r) { return true; }
    } catch(e) { 
      error("plugin " + i + " has failed on received key : " + 
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
}
function onWin32Message(wparam, lparam) {
  var SHOW_SUBPLUGIN_CONFIG = 0;
  var RELOAD_SUBPLUGINCONFIG = 1;
  if (wparam == SHOW_SUBPLUGIN_CONFIG) {
    FARR.debug("" + lparam);
    var index = 0;
    for (var i in plugins) {
      if (index == lparam - 1) break;
      index++;
    }
    plugins[i].showSettings();
  } else if (wparam == RELOAD_SUBPLUGINCONFIG) {
    var index = 0;
    for (var i in plugins) {
      if (index == lparam - 1) break;
      index++;
    }
    plugins[i].settingsChanged();
  }
}
function onDoAdvConfig() {
  try {
    fso.DeleteFile(g_currentDirectory + "\\FSSCSettings.ini");
  } catch(e) {
    // XXX
  }
  // extract plugins data for the settings
  var index = 1;
  for (var i in plugins) {
    FARR.setIniValue(g_currentDirectory + "\\FSSCSettings.ini", index, 
                     "PluginName", i);
    FARR.setIniValue(g_currentDirectory + "\\FSSCSettings.ini", index, 
                     "Icon", plugins[i].icon);
    index++;
  }
  FARR.exec(g_currentDirectory + "\\FSSCSettings.exe", "", g_currentDirectory);
  return true;
}
function onDoShowReadMe() {
}
function onSetStrValue(name, value) {
}
function onGetStrValue(name) {
}
