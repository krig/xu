# xu

`xu` is a console UI to [xmms2][xmms2]. Manage your music
playing from the terminal like it's meant to be managed.

  [xmms2]: https://xmms2.org/

* ncurses-based text mode interface

* Displays album art

* Manage playlist

* vim-style controls

## Installing

There's no installer yet, just make sure the `xu` binary is in your
`PATH`. `xu` depends on the `xmmsclient` python API that `xmms2`
provides, as well as [urwid][urwid] for curses support and [PIL][PIL]
for image manipulation.

  [urwid]: http://urwid.org/
  [PIL]: http://pythonware.com/products/pil/

## Using

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

    :artist loklok

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

Hit `p` to pause, `enter` to start playing the currently selected
playlist entry, `q` to exit `xu` (playback will continue
uninterrupted).

## Meta

Copyright (c) 2014 Kristoffer Grönlund <krig at koru se>

See LICENSE
