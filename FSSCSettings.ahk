#NoTrayIcon
#NoEnv
#SingleInstance force
Menu, Tray, Icon, FSubScript.ico
Gui, Add, ListView, r10 gMyListView, Name
ImageListID := IL_Create(100) 
LV_SetImageList(ImageListID)

index=0
Loop
{
    index:=index+1
    IniRead, pluginName, FSSCSettings.ini, %index%, PluginName
    if pluginName=ERROR
    {
    break
    }
    IniRead, icon, FSSCSettings.ini, %index%, Icon, FSubScript.ico

    IL_Add(ImageListID, icon)
    LV_Add("Icon" index, pluginName)
}

Gui, Add, Button, gClose, Close
Gui, Show,, FARR SubScript - Settings

goto End

MyListView:
if A_GuiEvent=DoubleClick
{
    DetectHiddenWindows, On
    PostMessage,0x401,0,%A_EventInfo%,,FScript/FARRSubScript ; 0 mean load plugin settings
}
return

Close:
GuiClose:
ExitApp

End:
