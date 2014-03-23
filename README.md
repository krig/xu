# media player frontends for xmms2

## xu

![xu](http://i.imgur.com/dhCRr4B.png "xu")


`xu` is a console UI to [xmms2][xmms2]. Manage your music
playing from the terminal like it's meant to be managed.

  [xmms2]: https://xmms2.org/

* ncurses-based text mode interface

* Displays album art

* Manage playlist

* vim-style controls

## xub

![xub](https://31.media.tumblr.com/2a972dff5176cb53689b5693593b9202/tumblr_inline_n2waatMl8A1qbvi7m.jpg "xub")

`xub` is a HTML5-based web ui for XMMS2. Start it, then go to
`http://localhost:5000` with your browser of choice (your browser
of choice is Chrome, preferrably).

## Installing

There's no installer yet, just make sure the `xu` and `xub` binaries
are in your `PATH`.

## Dependencies

* [urwid][urwid]
* [PIL][PIL]
* [flask][flask]
* [xmmsclient][xmmsclient]

  [urwid]: http://urwid.org/
  [PIL]: http://pythonware.com/products/pil/
  [flask]: http://flask.pocoo.org/
  [xmmsclient]: https://xmms2.org/

## Using xu

Just run `xu` to launch the interface. `xu` will try to start the
XMMS2 server if it's not running. It uses the `XMMS_PATH` environment
variable to locate the server, so set that if you're running the
server on a different computer.

To add music to the playlist, hit `:` to enter the command mode. Once
in command mode, you can add with the same type of commands that the
`xmms2` command line interface uses.

For example, to add all albums by Loklok the cat, use

    :add artist~loklok

There is a shortcut to this command, since I use it all the time:

    :+ loklok

Some other useful commands:

    :clear
    :playlist create <name>
    :playlist switch <name>
    :server rehash

Some of these commands have vim-style single letter shortcuts:

    :a(dd)
    :j(ump)
    :n(ext)
    :p(rev)
    :t(oggle)
    :s(top)
    :r(emove)
    :c(lear)
    (p):l(aylist)
    :q(uit)

Hit `p` to pause, `enter` to start playing the currently selected
playlist entry, `q` to exit `xu` (playback will continue
uninterrupted).

## Meta

Copyright (c) 2014 Kristoffer Grönlund <krig at koru se>

See LICENSE

Uses jQuery: http://jquery.com/

For Font Awesome, see: http://fontawesome.io/license/

Other font used is Oswald: http://www.google.com/fonts/specimen/Oswald
