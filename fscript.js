// FARRSubScript-specific variables 
displayname="FARRSubScript";
versionstring="0.9.7"; // XXX: locally customized
releasedatestring="Nov 25th, 2008";
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
UNKNOWN=0; FILE=1; FOLDER=2; ALIAS=3; URL=4; PLUGIN=5; CLIP=6; ALIASFILE=7;
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

function getUserVar(sectionName,variableName){return FARR.getStrValue("uservar."+sectionName+"."+variableName); }

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
  var maxdepth = 2;
  function processFolder(foldername, depth) {
    var fld = fso.GetFolder(foldername);
    var fldc = new Enumerator(fld.SubFolders);
    var fln;
    for (; !fldc.atEnd(); fldc.moveNext()) {
      try {
        var currentDirectory = fldc.item(); // used for eval(), full path
//----------------------------CZB---------------------------------
//        fln = currentDirectory + "\\fsubscript.js";
//        if (fso.FileExists(fln)) {
//          eval(getTextFile(fln));
//        }
        var fldf = new Enumerator(currentDirectory.Files);
        for (; !fldf.atEnd(); fldf.moveNext()) {
          var rgxp = new RegExp("^fsubscript.*\\.js");
          if(fldf.item().Name.search(rgxp) != -1){
            fln = currentDirectory + "\\" + fldf.item().Name;
            eval(getTextFile(fln));
          }
        }
//----------------------------CZB---------------------------------
      } catch (e) {
        error("error occured while loading " + 
              currentDirectory + "\\fsubscript.js\n" + 
              "message: " + e.message + " " + "name: " + e.name);
      }
      if (depth < maxdepth) {
        processFolder(currentDirectory, depth + 1);
      }
    }    
  }
  processFolder(directory + "\\..", 0);
//----------------------------CZB---------------------------------
  for (var i in plugins) {
    try{
      pi = plugins[i];
      if (!pi.onInit) { continue; }
      pi.onInit();
    } catch(e) {
      error("plugin " + i + " has failed on onInit : " +
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
//----------------------------CZB---------------------------------
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
  // qma: (q)uery (m)atch (a)rray
  var qma = queryraw.match("^([^ ]+) ?(.*)"); // XXX: simplify?
  var first, rest;
  if (qma) { 
    first = qma[1];
    rest = qma[2];
    if (first === "aplugins") {
      for (var i in plugins) {
	var pi = plugins[i];
        var title = (pi.displayName || i) + 
	            " (" + pi.version + " - " + pi.lastChange + ")";
        FARR.emitResult(querykey, title, pi.aliasstr, pi.icon || iconfilename, 
			ALIAS, MATCH_AGAINST_SEARCH, 99, pi.aliasstr);
      }
      cleanup(); return;
    }
  }
  /*
    2008-11-23 mouser (paraphrased):
    1) if regex plugin
    check regex, if matches
    set exact flag=true and set filter=regexfilter
    2) if not regex plugin, 
    check first word, if matches
    set exact flag=true and set filter=rest of string
    3) call setfilter if filter!=""
    4) call search
    5) call stopsearch if exact=true
    XXX: not following the above exactly
  */
  // mpa: (m)atched (p)lugin (a)lias?
  // prs: (p)lugin (r)egex (s)tring
  // pqma: (p)lugin (q)uery (m)atch (a)rray
  // prsf: (p)lugin (r)egex (s)earch (f)liter XXX:
  // prfg: (p)lugin (r)egex (f)ilter (g)roup
  // pi: (p)lugin (i)
  var filterstr, mpa, prs, pqma, prfg, pi;
  for (var i in plugins) {
    filterstr = null;
    pi = plugins[i];
    try {
      //mpa = queryraw.indexOf(pi.aliasstr) == 0; // XXX
      mpa = false;
      if (first) {
        // pi.aliasstr may be undefined or empty string
        mpa = (pi.aliasstr === first);
      }
      prs = pi.regexstr; 
      if (prs) { // 1) regex plugin
        pqma = queryraw.match(prs); 
        if (pqma) {
          //prsf = pi.regexsearchfilter; 
          // approximate initially by using regexfiltergroup
          prfg = pi.regexfiltergroup; 
          if (prfg && pqma[prfg]) { 
            filterstr = pqma[prfg];
          }
        }
      } else { // 2) non-regex plugin
        if (mpa && rest) { // XXX
          filterstr = rest;
        }
      }
      if (filterstr) { // 3) filter
        forceResultFilter(filterstr); 
      }
      // 4) search
      if (!pi.search) { continue; }
      pi.search(querykey, mpa, queryraw, querynokeyword, modifier, 
                triggermethod);
      if (mpa) { // 5) stop
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
  var pi, r;
  for (var i in plugins) {
    try {
      pi = plugins[i];
      if (!pi.trigger) { continue; }
      r = pi.trigger(path, title, groupname, pluginid, thispluginid, score, 
		     entrytype, args);
      if ((r & 3) != 0) // XXX: may be we can use 'constants' for readability?
        return r; // stop if stop or closed is required
    } catch(e) { 
      error("plugin " + i + " has failed on trigger : " + 
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
}
function onReceiveKey(key, altpressed, controlpressed, shiftpressed) {
  var pi, r;
  for (var i in plugins) {
    try {
      pi = plugins[i];
      if (!pi.receive) { continue; }
      r = pi.receive(key, altpressed, controlpressed, shiftpressed);
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
    plugins[i].showSettings(); // XXX: i -> index?
  } else if (wparam == RELOAD_SUBPLUGINCONFIG) {
    var index = 0;
    for (var i in plugins) {
      if (index == lparam - 1) break;
      index++;
    }
    plugins[i].settingsChanged(); // XXX: i -> index?
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
//----------------------------CZB---------------------------------
  var pi;
  var rtrn = false;
  for (var i in plugins) {
    try{
      pi = plugins[i];
      if (!pi.onSetStrValue) { continue; }
      if( pi.onSetStrValue(name,value) ) rtrn = true;
    } catch(e) {
      error("plugin " + i + " has failed on onSetStrValue : " +
            "message: " + e.message + " " + "name: " + e.name);
    }
  }
  return rtrn;
//----------------------------CZB---------------------------------
}
function onGetStrValue(name) {
}

// Local Variables:
// c-basic-offset: 2
// End: