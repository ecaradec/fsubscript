#NoTrayIcon
#NoEnv
#SingleInstance force

Gui, Add, ListView, r10 gMyListView, Name
ImageListID := IL_Create(100) 
LV_SetImageList(ImageListID)

Loop, %0%  ; For each parameter:
{
    param := %A_Index%  ; Fetch the contents of the variable whose name is contained in A_Index.
    MyVar = % "..\" . param . "\" . param . ".ico"
    IL_Add(ImageListID, MyVar)
    LV_Add("Icon" A_Index, param)
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
