HabrCommentsFilter
==================
This userscript allows you to filter comments by rating on [Habrahabr.ru](http://habrahabr.ru/), [Geektimes.ru](http://geektimes.ru/) and [Megamozg.ru](http://megamozg.ru/) 

##How to install
1. get repository
2. install **dest/habr-comments-filter.user.js** into your browser    
    * **firefox**:
        1. install [Greasemonkey](https://addons.mozilla.org/ru/firefox/addon/greasemonkey/)
        2. drag the userscript onto the page
    * **chrome**:
        1. open extensions page (there are two ways):
            - click on the Customize and control -> Settings -> Extensions 
            - open the URL: [chrome://extensions/](chrome://extensions/)
        2. drag the userscript onto page
        
##Hotkeys
increment min rating: **CTRL + up**         
decrement min rating: **CTRL + down**       
      
##Changelog
###v2.2.1
- add support for Megamozg.ru
- fix after updating markup on the sites

###v2.2
- add support for Geektimes.ru

###v2.1
- add hotkeys
- change design

###v2.0
- rewrite filtering without jQuery
- rewrite calculating of average rating
- add instant filter
- add number of shown comments
- add support for Firefox and Chrome
- add tests (Karma and Jasmine)
- add build with Grunt