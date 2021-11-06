function align()
{

        var lmt = document.getElementById('centrage');
        var container = document.documentElement;

        if(lmt && container)
        {
            var containerHeight;
            if (container.innerWidth)
            {
            containerHeight = container.innerHeight;
                }
                else
                {
            containerHeight = container.clientHeight;
                }
            var lmtHeight;
            if (lmt.innerWidth)
            {
            lmtHeight = lmt.innerHeight;
                }
                else
                {
            lmtHeight = lmt.offsetHeight;
                }
                var y = Math.ceil((containerHeight - lmtHeight) / 2);
                if(y < 0)
                {
                        y = 0;
                }
                lmt.style.position = "relative";
                lmt.style.top = y + "px";
        }
        if (document.getElementById)
        {
                document.body.style.visibility = 'visible';
        }

}

function addevent(obj,evt,fn,capt){
        if(obj.addEventListener)
        {
                obj.addEventListener(evt, fn, capt);
                return true;
        }
        else if(obj.attachEvent)
        {
                obj.attachEvent('on'+evt, fn);
                return true;
        }
        else return false;
}

if (document.getElementById && document.getElementsByTagName)
{
        addevent(window, 'load', align, false);
        addevent(window, 'resize', align, false);
}