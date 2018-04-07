const wrdCont = document.getElementById("wordle-container");
const SIZE = 20;
let lastURI = "";
let start = 101;
function main()
{
    wrdCont.width = window.innerWidth;
    wrdCont.height = window.innerHeight;
    let repeatedFunc = function ()
    {
        twilioGetMessages();
        setTimeout(repeatedFunc, 2000);
    }
    window.addEventListener("onRecieved", (event) =>
    {
        let rawMessages = event.detail.obj.messages;
        console.log(rawMessages.length);
        if (lastURI != rawMessages[0]["uri"])
        {
            start--;
            if (start < 0)
            {
                start = 0;
            }    
            let list = [];
            for (let i = 0; i < rawMessages.length - start; i++)
            {
                if (rawMessages[i]["direction"] === "inbound")
                {
                    let msg = rawMessages[i]["body"];
                    let words = msg.split(" ");
                    for (let j = 0; j < words.length; j++)
                    {
                        if (!filtered(words[j]))
                        {
                            list = addTolist(list, words[j]);
                        }    
                    }
                }
            }
            if (lastURI === "")
            {
                list = [["(267) 619-7204", 70], ["Text", 50], ["Powered by Twilio", 10], ["Demo by Shivan Modha", 10]];
            }
            setWordle(list);
            lastURI = rawMessages[0]["uri"];
        }
    });
    setWordle([]);
    repeatedFunc();
}
function filtered(add)
{
    let chck = " " + add + " ";
    for (let i = 0; i < FILTER.length; i++)
    {
        if (add.toLowerCase().search(new RegExp(FILTER[i].toLowerCase(), "i")) > -1)
        {
            if (add.length < 1)
            {
                return true;
            }
        }    
    }    
    return false;
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
    request.open("GET", "https://api.twilio.com/2010-04-01/Accounts/" + USERNAME + "/Messages.json?PageSize=100&Page=0", true);
    request.setRequestHeader("Authorization", "Basic " + btoa(USERNAME + ":" + PASSWORD));
    request.onload = function(event)
    {
        if (request.status === 200)
        {
            window.dispatchEvent(new CustomEvent("onRecieved", { detail: { obj: JSON.parse(request.response) } }));
        }
        console.log(request);
    };
    request.send();
}
main();