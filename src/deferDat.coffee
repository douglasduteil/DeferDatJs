
###
  Defer Dat Js !
  Simple way to defer.
  A fork of JAL (https://github.com/tail-f-systems/JAL)
  Copyright 2013, Douglas Duteil 
###

(( w, d ) ->
  
  deferDat = (->
    ___DEBUG___ = false
    loaderscript = undefined
    isCool = yes
    queue = []
    queuePos = currentID = -1;
    pushing = yes;
    head = d.getElementsByTagName("head")[0]
  
  
  
    # Look for #defer-script options 
    (->
      return if d.getElementById('defer-script') is null
      qs = d.getElementById('defer-script').src.replace(/^[^\?]+\??/,'').split(',')
      [0..qs.length - 1].map (i) ->
        if qs[i] is "debug"
          ___DEBUG___ = true
        else if qs[i].indexOf("load=") > -1
          loaderscript = qs[i].substring(5)
        return
    )()
  
    # Ready to laod the loader ?
    if loaderscript
      ((s) ->
        head.appendChild( (->
          a = d.createElement("script")
          a.setAttribute "type", "text/javascript"
          a.setAttribute "src", s
          a.setAttribute "async", "true"
          a
        )()
        )
        return
      ) loaderscript
  
  
    ###
      GET Serious !
    ###
  
  
    # Inject an html tag (script/link) into the document head so the
    # browser loads it.
    
    createTag = (resource, monitor)  ->
      
      # Javascript
      if (/.js$|.js\?/i).test(resource)
        tag = d.createElement("script")
        tag.setAttribute "type", "text/javascript"
        tag.setAttribute "src", resource
        tag.setAttribute "async", "true"
  
        _onload = (failed) ->
          return  if tag.readyState and tag.readyState isnt "complete" and tag.readyState isnt "loaded"
          monitor resource, failed
          tag.onload = tag.onreadystatechange = null
          tag.removeEventListener "load", _onload  if tag.addEventListener
          return
  
        __onSuccess = ->
          _onload no # don't fail 
          return
  
        __onError = ->
          _onload yes  # fail 
          return
  
        if tag.addEventListener
          tag.addEventListener "load", __onSuccess
          tag.addEventListener "error", __onError
        else
          tag.onload = tag.onreadystatechange = __onSuccess
          tag.onerror = __onError
  
      tag
    
  
  
    # Resource group loaded. Call listeners.
    loaded = (res, failed) ->
      return if not isCool
      unless failed
        res.success() unless res.success is null
        nextResource()
      else
        if res.fail is null
          epicFail()
        else
          if typeof res.fail is "function"
            res.fail nextResource
        isCool = no
  
      return
  
  
  
    # The monitor monitors the loading of the resource
    createMonitor = (res) ->
      copy = (if res and res.files then [].concat(res.files) else [])
      anyFail = no
      console.log "New Monitor !", copy if ___DEBUG___ and console
      (resource, failed) ->
        i = 0
        len = copy.length
        while i < len
          if resource is copy[i]
            copy = copy.slice(0, i).concat(copy.slice(i + 1))
            break;
          i++;
        anyFail = yes if failed
        loaded res, anyFail if copy.length is 0
  
  
  
  
  
  
  
  
  
  
    # Load a resource group.
    loadResources = (res)->
      monitor = createMonitor(res)
      i = 0
      len = res.files.length

      while i < len
        tag = createTag(res.files[i], monitor)
        head.appendChild tag  if tag
        i++
      return
  
  
  
  
  
  
    nextResource = ->
      res = undefined
      if queue.length is 0
        happyEnd();
      else
        res = queue.shift()
        console.log "Neeext !", res if ___DEBUG___ and console
        loadResources res
      return
  
  
  
  
  
  
  
  
    load = (files) ->
      console.log "Will load", files if ___DEBUG___ and console
      return deferDat  if files and files.length is 0
      files = [files]  if typeof files is "string"
      res =
        files: files
        success: null
        fail: null
        always: null
  
      if pushing
        queue.push res
        currentID = queue.length - 1
      else
        currentID = 0
        queue.splice queuePos, 0, res
        queuePos++
  
      setTimeout nextResource, 10  if queue.length is 1
  
      deferDat


    success = (callback) ->
      console.log "If success :", callback if ___DEBUG___ and console
      queue[currentID].success = callback
      deferDat
  
    fail = (callback) ->
      console.log "If fail :", callback if ___DEBUG___ and console
      queue[currentID].fail = callback
      deferDat
  
    always = (callback) ->
      console.log "Will always do", callback if ___DEBUG___ and console
      deferDat
  
    happyEnd = ->
      console.log "They all lived happily ever after d:D" if ___DEBUG___ and console
    epicFail = ->
      console.log "Fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu" if ___DEBUG___ and console
  
    return {
    load : load
    success : success
    fail : fail
    always : always
    happyEnd : (callback) ->
      console.log "Will success finish with", callback if ___DEBUG___ and console
      happyEnd = callback
      deferDat
  
    epicFail : (callback) ->
      console.log "Will fail finish with", callback if ___DEBUG___ and console
      epicFail = callback
      deferDat
    }
  )()
  
  w.deferDat = deferDat
  return

) window, document 