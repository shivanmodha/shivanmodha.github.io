const wrdCont = document.getElementById("wordle-container");
const SIZE = 20;
let lSize = -1;
let start = 0;
function main()
{
    wrdCont.width = window.innerWidth;
    wrdCont.height = window.innerHeight;
    let repeatedFunc = function ()
    {
        twilioGetMessages();
        setTimeout(repeatedFunc, 5000);
    }
    window.addEventListener("onRecieved", (event) =>
    {
        let rawMessages = event.detail.obj.messages;
        if (lSize != rawMessages.length)
        {
            if (lSize === -1)
            {
                start = rawMessages.length;
            }    
            let list = [];
            for (let i = 0; i < rawMessages.length - start; i++)
            {
                if (rawMessages[i]["direction"] === "inbound")
                {
                    list = addTolist(list, rawMessages[i]["body"]);
                }
            }
            if (lSize === -1)
            {
                list = [["(908) 332-5411", 70], ["Text", 50], ["Powered by Twilio", 10], ["Demo by Shivan Modha", 10]];
            }    
            setWordle(list);
            lSize = rawMessages.length;
        }    
    });
    setWordle([]);
    repeatedFunc();
}
function addTolist(list, add)
{
    let adIn = false;
    for (let i = 0; i < list.length; i++)
    {
        if (list[i][0].toLowerCase() === add.toLowerCase())
        {
            adIn = true;
            list[i][1] += SIZE;
            break;
        }
    }
    if (!adIn)
    {
        list.push([add, SIZE]);
    }    
    return list;
}
function setWordle(list)
{
    WordCloud(wrdCont, { list: list });
}
function twilioGetMessages()
{
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.twilio.com/2010-04-01/Accounts/" + USERNAME + "/Messages.json", true);
    request.setRequestHeader("Authorization", "Basic " + btoa(USERNAME + ":" + PASSWORD));
    request.onload = function(event)
    {
        if (request.status === 200)
        {
            window.dispatchEvent(new CustomEvent("onRecieved", { detail: { obj: JSON.parse(request.response) } }));
        }
    };
    request.send();
}
main();