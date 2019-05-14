import sys
import time
import mido

"""
find_port

A utility to print out the fully qualified name (the one the mido library sees) from a
base port name (as specified when first opening the port).

This utility is necessary because on Ubuntu Linux when ennumerating the existing MIDI ports
the names don't exactly match the identifier used to create them. This wasn't necessary on
mac. 
"""

MAX_WAIT = 10

if (len(sys.argv) == 1):
    print "Prints the fully qualified name of a MIDI port that matches a base port name"
    print "Usage: %s <base_port_name>" % sys.argv[0]
    exit(1)

base_port = sys.argv[1]

wait = 0
loop_delay = 0.1
while wait < MAX_WAIT:
    for port in mido.get_input_names():
        if base_port in port:
            print port
            exit(0)
    time.sleep(loop_delay)
    wait += loop_delay

# Timed out without finding the port
exit(1)
