import RPi.GPIO as IO
import time
import sys

# programming t04:07 PMhe GPIO by BOARD pin numbers, GPIO21$
IO.setmode(IO.BOARD)
# initialize digital pin40 as an output.
IO.setup(40, IO.OUT)
# initialize digital pin38 as an input.
IO.setup(38, IO.IN)
while True:
    try:
        if IO.input(38):
            # turn the LED on
            IO.output(40, 1)
        else:
            # turn the LED on
            IO.output(40, 0)
    except KeyboardInterrupt:
        # cleans up the buffer
        IO.cleanup()
        sys.exit()
