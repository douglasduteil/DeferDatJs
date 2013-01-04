# DeferDatJS

Conditional resource loader for web browsers.

# About

DeferDatJS is a fork of [JAL](https://github.com/tail-f-systems/JAL).

# Installation

Add the following script tag to your web page:
```html
<script id="loader-script" src="js/deferDat.js?debug" type="text/javascript"></script>
```
The querystring parameters are optional and should be used for debugging only.
The _debug_ parameter makes JAL output debug information to the Javascript
console, mainly how loading is progressing. 

# Using DeferDatJS

DeferDatJS will start loading resources with a 10 ms delay when they are registered.
Registration is straightforward and can be chained. This means that you can
conditionally load resources. JAL has a convenience function for this, but
you don't have to use it. It's all a matter of style.

# Examples

## Basic loading

```javascript
deferDat
    .load('js/jquery.min.js')
    .load([
       'js/script-one.min.js'
      ,'js/script-two.min.js'
    ])
    .happyEnd(function() {
        // Start app
    })
```

## Using the #success callback

```javascript
deferDat
    .load('js/jquery.min.js')
    .success(function(){
        // Stop jQuery from triggering the "ready" event
        $.holdReady(true)
    })
    .load([
       'js/script-one.min.js'
      ,'js/script-two.min.js'
    ])
    .happyEnd(function() {
        // Allow jQuery to trigger the "ready" event
        $.holdReady(false)
        // Start app
    })
```

## Asynchronous loading of the loader

To load DeferDatJS and a load script asynchronously inline a script snippet
similar to the following in your web page:
```html
<script type="text/javascript">
    document.getElementsByTagName('head')[0].appendChild((function() {
        var scr = document.createElement('script')
        scr.setAttribute('id', 'defer-script');
        scr.setAttribute('type', 'text/javascript');
        scr.setAttribute('src', 'js/deferDat.js?debug,load=js/load.js');
        scr.setAttribute('async', 'true');
        return scr
    })())
</script>
````
This will load DeferDatJS asynchronously and not block the main page from loading
other resources.  
Here is a minified version :
```html
<script type="text/javascript">
    (function(d,b){var c=document;c.getElementsByTagName("head")[0].appendChild(function(){var a=c.createElement("script");void 0!=b&&a.setAttribute("id",b);a.setAttribute("type","text/javascript");a.setAttribute("src",d);a.setAttribute("async","true");return a}())})
    ('js/deferDat.js?debug,load=load.js', 'defer-script');
</script>
````
[Demo](http://douglasduteil.github.com/DeferDatJs/sample/async.html)

