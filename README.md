jQuery.shadowtext
=================
Version 1.1

Copyright (c) 2011-2015 Martijn W. van der Lee
Licensed under the MIT.

Interactive, animated text shadow effects.

Important! Internet Explorer (atleast upto and including IE9) do not support
text-shadow. As such this plug-in is not supported for Internet Explorer.

Syntax:
    $(<context>).shadowtext(<options>);
    
Arguments:
    context (required)
        The DOM tree node containing the text to apply the shadow effect to.
    options (optional)
        You can specify a map of options to change the default behaviour:
            axis (default '')
                Restrict the axis of movement. Either 'x' or 'y' are allowed. Leave
                empty if you don't want to restrict the axis.
            blurClose (default 0)
                The amount of blur when closest to the text.            
            blurFar (default 10)
                The amount of blur when farthest to the text.
            color (default "#000")
                Set the color of the shadow. Allowed types are 3 and 6 digit hex
                codes, rgb(), rgba() and color names. Alpha values are ignored.
            distance (default 10)
                Maximum distance of the shadow from the text.
            easing (default '')
                If specified, an easing method will be used to determine the distance
                of the shadow (also influences blur and opacity) based on the mouse
                distance.
            framerate (default 13)
                Framerate measured in frames-per-second. Don't change unless you
                want a specific effect. By default this is set at the same framerate
                as jQuery effects.
            hideText (default false)
                Enable this option to hide the text and only show the shadow.
            mouseRange (default 500)
                When the mousepointer is at or beyond the specified mouseRange from
                the text, the shadow will be at it's farthest.
            opacityClose (default 1)
                The amount of opacity when closest to the text. Range 0 to 1.
            opacityFar (default 1)
                The amount of opacity when closest to the text. Range 0 to 1.
        Note that if you also load my jQuery.px plugin, you can access all it's unit
        types for distance, blurClose, blurFar and mouseRange.
    
Return:
    Chainable jQuery nodes.

Examples:
    $('.demo-default').shadowtext();
    
    $('.demo-short-range').shadowtext({
        color:            '#960',
        distance:        50,
        blurClose:        2,
        blurFar:        50,
        opacityClose:    1,
        opacityFar:        0,
        mouseRange:        100,
        axis:            'x'
    });    
    
    $('.demo-axis').shadowtext({
        distance:    '1em',
        axis:        'y',
        mouseRange:    '50vh'
    });    